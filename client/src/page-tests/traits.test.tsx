import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
  userEvent,
} from 'test/utils'
import { rest } from 'msw'
import { server } from 'test/mocks/server'
import Traits from '../pages/admin/traits'
import { buildTrait } from 'test/mocks/test-factories'
import { CreateTraitDto, Trait } from 'schemas'
import { apiBaseUrl, endpoints } from 'config'

const traitsUrl = `${apiBaseUrl}/${endpoints.traits}`

describe('traits', () => {
  it('shows a list of traits', async () => {
    const traits = [buildTrait(), buildTrait()]
    server.use(
      rest.get(traitsUrl, (req, res, ctx) => {
        return res(ctx.json(traits))
      })
    )

    render(<Traits />)

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
      rest.get(traitsUrl, (req, res, ctx) => {
        return res(ctx.json(serverTraits))
      }),
      rest.post<CreateTraitDto>(traitsUrl, (req, res, ctx) => {
        const {
          body: { name },
        } = req
        const createdTrait = { ...trait, name }
        serverTraits.push(createdTrait)
        return res(ctx.status(201), ctx.json(createdTrait))
      })
    )

    render(<Traits />)

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
      rest.get(traitsUrl, (req, res, ctx) => {
        return res(ctx.json(serverTraits))
      }),
      rest.delete(`${traitsUrl}/:id`, (req, res, ctx) => {
        const {
          params: { id },
        } = req

        const deletedTraits = serverTraits.find((f) => f.id === id)
        serverTraits = serverTraits.filter((f) => f.id !== id)

        return res(ctx.json(deletedTraits))
      })
    )

    render(<Traits />)

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
