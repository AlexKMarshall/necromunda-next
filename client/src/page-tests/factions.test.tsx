import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
  userEvent,
  buildGetCellValueFactory,
} from 'test/utils'
import { rest } from 'msw'
import { server } from 'test/mocks/server'
import Factions from '../pages/admin/factions'
import { buildFaction } from 'test/mocks/test-factories'
import { CreateFactionDto, Faction } from 'schemas'
import { apiBaseUrl, endpoints } from 'config'

const factionsUrl = `${apiBaseUrl}/${endpoints.factions}`

describe('factions', () => {
  it('shows a list of factions', async () => {
    const factions = [buildFaction(), buildFaction()]
    server.use(
      rest.get(factionsUrl, (req, res, ctx) => {
        return res(ctx.json(factions))
      })
    )

    render(<Factions />)

    expect(
      screen.getByRole('heading', { name: /factions/i })
    ).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const table = screen.getByRole('table')
    const headerRow = within(table).getAllByRole('row')[0]
    const nameHeader = within(headerRow).getByRole('columnheader', {
      name: /name/i,
    })
    const rows = within(within(table).getByTestId('table-body')).getAllByRole(
      'row'
    )

    const getCellValueFactory = buildGetCellValueFactory(headerRow)

    expect(rows).toHaveLength(factions.length)
    factions.forEach((faction, index) => {
      const getCellValue = getCellValueFactory(rows[index])

      expect(getCellValue(nameHeader)).toHaveTextContent(faction.name)
    })
  })

  it('allows creating a faction', async () => {
    const faction = buildFaction()
    const serverFactions: Faction[] = []
    server.use(
      rest.get(factionsUrl, (req, res, ctx) => {
        return res(ctx.json(serverFactions))
      }),
      rest.post<CreateFactionDto>(factionsUrl, (req, res, ctx) => {
        const {
          body: { name },
        } = req
        const createdFaction = { ...faction, name }
        serverFactions.push(createdFaction)
        return res(ctx.status(201), ctx.json(createdFaction))
      })
    )

    render(<Factions />)

    userEvent.click(screen.getByText(/add faction/i))

    expect(
      screen.getByRole('heading', { name: /add new faction/i })
    ).toBeInTheDocument()

    userEvent.type(screen.getByLabelText(/name/i), faction.name)
    userEvent.click(screen.getByRole('button', { name: /add faction/i }))

    await waitForElementToBeRemoved(screen.getByRole('dialog'))

    const newFaction = await screen.findByRole('cell', { name: faction.name })
    expect(newFaction).toBeInTheDocument()
  })

  it('allows deleting a faction', async () => {
    let serverFactions = [buildFaction(), buildFaction()]
    const initialFactions = [...serverFactions]
    server.use(
      rest.get(factionsUrl, (req, res, ctx) => {
        return res(ctx.json(serverFactions))
      }),
      rest.delete(`${factionsUrl}/:id`, (req, res, ctx) => {
        const {
          params: { id },
        } = req

        const deletedFaction = serverFactions.find((f) => f.id === id)
        serverFactions = serverFactions.filter((f) => f.id !== id)

        return res(ctx.json(deletedFaction))
      })
    )

    render(<Factions />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const [faction1, faction2] = initialFactions

    const deleteFaction1Button = screen.getByRole('button', {
      name: new RegExp(`${faction1.name}`, 'i'),
    })

    userEvent.click(deleteFaction1Button)

    await waitForElementToBeRemoved(deleteFaction1Button)

    expect(screen.queryByText(faction1.name)).not.toBeInTheDocument()
    expect(screen.getByText(faction2.name)).toBeInTheDocument()
  })
})
