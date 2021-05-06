import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { server } from 'test/mocks/server'
import Factions from '../pages/admin/factions'
import { buildFaction } from 'test/mocks/test-factories'

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

afterEach(async () => {
  // queryClient.clear()
})

describe('Factions', () => {
  it('shows a list of factions', async () => {
    const factions = [buildFaction(), buildFaction()]
    server.use(
      rest.get('http://localhost:3000/factions', (req, res, ctx) => {
        return res(ctx.json(factions))
      })
    )

    render(<Factions />, { wrapper: Providers })

    expect(
      screen.getByRole('heading', { name: /factions/i })
    ).toBeInTheDocument()

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

    expect(rows).toHaveLength(factions.length)
    factions.forEach((faction, index) => {
      const row = rows[index]

      expect(within(row).getByText(faction.name)).toBeInTheDocument()
    })
  })

  it('allows deleting a faction', async () => {
    let serverFactions = [buildFaction(), buildFaction()]
    const initialFactions = [...serverFactions]
    server.use(
      rest.get('http://localhost:3000/factions', (req, res, ctx) => {
        return res(ctx.json(serverFactions))
      }),
      rest.delete('http://localhost:3000/factions/:id', (req, res, ctx) => {
        const {
          params: { id },
        } = req

        const deletedFaction = serverFactions.find((f) => f.id === id)
        serverFactions = serverFactions.filter((f) => f.id !== id)

        return res(ctx.json(deletedFaction))
      })
    )

    render(<Factions />, { wrapper: Providers })

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const [faction1, faction2] = initialFactions

    const deleteFaction1Button = screen.getByRole('button', {
      name: new RegExp(`${faction1.name}`, 'i'),
    })

    userEvent.click(deleteFaction1Button)

    await waitForElementToBeRemoved(deleteFaction1Button)

    expect(screen.queryByText(faction1.name)).not.toBeInTheDocument()
    expect(screen.getByText(faction2.name)).toBeInTheDocument()

    // screen.debug()
  })
})
