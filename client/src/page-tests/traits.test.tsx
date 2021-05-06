import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { server } from 'test/mocks/server'
import Traits from '../pages/admin/traits'
import { buildTrait } from 'test/mocks/test-factories'
import { CreateTraitDto, Trait } from 'schemas'

const Providers: React.ComponentType = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Traits', () => {
  it('shows a list of traits', async () => {
    const traits = [buildTrait(), buildTrait()]
    server.use(
      rest.get('http://localhost:3000/traits', (req, res, ctx) => {
        return res(ctx.json(traits))
      })
    )

    render(<Traits />, { wrapper: Providers })

    expect(screen.getByRole('heading', { name: /traits/i })).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    expect(
      screen.getByRole('columnheader', { name: /name/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /actions/i })
    ).toBeInTheDocument()

    const table = screen.getByRole('table')
    const rows = within(within(table).getByTestId('table-body')).getAllByRole(
      'row'
    )

    expect(rows).toHaveLength(traits.length)
    traits.forEach((traits, index) => {
      const row = rows[index]

      expect(within(row).getByText(traits.name)).toBeInTheDocument()
    })
  })

  it('allows creating a trait', async () => {
    const trait = buildTrait()
    const serverTraits: Trait[] = []
    server.use(
      rest.get('http://localhost:3000/traits', (req, res, ctx) => {
        return res(ctx.json(serverTraits))
      }),
      rest.post<CreateTraitDto>(
        'http://localhost:3000/traits',
        (req, res, ctx) => {
          const {
            body: { name },
          } = req
          const createdTrait = { ...trait, name }
          serverTraits.push(createdTrait)
          return res(ctx.status(201), ctx.json(createdTrait))
        }
      )
    )

    render(<Traits />, { wrapper: Providers })

    userEvent.click(screen.getByRole('button', { name: /add trait/i }))

    expect(
      screen.getByRole('heading', { name: /add new trait/i })
    ).toBeInTheDocument()

    userEvent.type(screen.getByRole('textbox', { name: /name/i }), trait.name)
    userEvent.click(screen.getByRole('button', { name: /add trait/i }))

    await waitForElementToBeRemoved(screen.getByRole('dialog'))

    const newTrait = await screen.findByRole('cell', { name: trait.name })
    expect(newTrait).toBeInTheDocument()
  })

  it('allows deleting a trait', async () => {
    let serverTraits = [buildTrait(), buildTrait()]
    const initialTraits = [...serverTraits]
    server.use(
      rest.get('http://localhost:3000/traits', (req, res, ctx) => {
        return res(ctx.json(serverTraits))
      }),
      rest.delete('http://localhost:3000/traits/:id', (req, res, ctx) => {
        const {
          params: { id },
        } = req

        const deletedTraits = serverTraits.find((f) => f.id === id)
        serverTraits = serverTraits.filter((f) => f.id !== id)

        return res(ctx.json(deletedTraits))
      })
    )

    render(<Traits />, { wrapper: Providers })

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const [trait1, trait2] = initialTraits

    const deleteTrait1Button = screen.getByRole('button', {
      name: new RegExp(`${trait1.name}`, 'i'),
    })

    userEvent.click(deleteTrait1Button)

    await waitForElementToBeRemoved(deleteTrait1Button)

    expect(screen.queryByText(trait1.name)).not.toBeInTheDocument()
    expect(screen.getByText(trait2.name)).toBeInTheDocument()
  })
})
