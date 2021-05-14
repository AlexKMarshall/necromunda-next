import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
  buildGetCellValueFactory,
  userEvent,
} from 'test/utils'
import { rest } from 'msw'
import { server } from 'test/mocks/server'
import FighterTypes from '../pages/admin/fighter-types'
import {
  buildFaction,
  buildFighterCategory,
  buildFighterType,
} from 'test/mocks/test-factories'
import { CreateFighterTypeDto, FighterStats, FighterType } from 'schemas'
import { apiBaseUrl, endpoints } from 'config'

const fighterTypesUrl = `${apiBaseUrl}/${endpoints.fighterTypes}`
const factionsUrl = `${apiBaseUrl}/${endpoints.factions}`
const fighterCategoriesUrl = `${apiBaseUrl}/${endpoints.fighterCategories}`

describe('fighter Types', () => {
  it('shows a list of fighter types', async () => {
    const fighterTypes = [buildFighterType(), buildFighterType()]
    server.use(
      rest.get(fighterTypesUrl, (req, res, ctx) => {
        return res(ctx.json(fighterTypes))
      })
    )

    render(<FighterTypes />)

    expect(
      screen.getByRole('heading', { name: /fighter types/i })
    ).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const table = screen.getByRole('table')
    const rows = within(within(table).getByTestId('table-body')).getAllByRole(
      'row'
    )
    expect(rows).toHaveLength(fighterTypes.length)
    const headerRow = screen.getAllByRole('row')[0]

    const nameHeader = screen.getByRole('columnheader', { name: /name/i })
    const costHeader = screen.getByRole('columnheader', { name: /cost/i })
    const factionHeader = screen.getByRole('columnheader', { name: /faction/i })
    const fighterCategoryHeader = screen.getByRole('columnheader', {
      name: /fighter category/i,
    })
    const mHeader = screen.getByRole('columnheader', {
      name: /movement/i,
    })
    const wsHeader = screen.getByRole('columnheader', { name: /weapon skill/i })
    const bsHeader = screen.getByRole('columnheader', {
      name: /ballistic skill/i,
    })
    const sHeader = screen.getByRole('columnheader', { name: /strength/i })
    const tHeader = screen.getByRole('columnheader', { name: /toughness/i })
    const wHeader = screen.getByRole('columnheader', { name: /wounds/i })
    const iHeader = screen.getByRole('columnheader', { name: /initiative/i })
    const aHeader = screen.getByRole('columnheader', { name: /attacks/i })
    const ldHeader = screen.getByRole('columnheader', { name: /leadership/i })
    const clHeader = screen.getByRole('columnheader', { name: /cool/i })
    const wilHeader = screen.getByRole('columnheader', { name: /will/i })
    const intHeader = screen.getByRole('columnheader', {
      name: /intelligence/i,
    })

    const getCellValueFactory = buildGetCellValueFactory(headerRow)

    fighterTypes.forEach((fighterType, index) => {
      const row = rows[index]
      const getCellValue = getCellValueFactory(row)

      expect(getCellValue(nameHeader)).toHaveTextContent(fighterType.name)
      expect(getCellValue(costHeader)).toHaveTextContent(
        fighterType.cost.toString()
      )
      expect(getCellValue(factionHeader)).toHaveTextContent(
        fighterType.faction.name
      )
      expect(getCellValue(fighterCategoryHeader)).toHaveTextContent(
        fighterType.fighterCategory.name
      )
      expect(getCellValue(mHeader)).toHaveTextContent(
        fighterType.fighterStats.movement.toString()
      )
      expect(getCellValue(wsHeader)).toHaveTextContent(
        fighterType.fighterStats.weaponSkill.toString()
      )
      expect(getCellValue(bsHeader)).toHaveTextContent(
        fighterType.fighterStats.ballisticSkill.toString()
      )
      expect(getCellValue(sHeader)).toHaveTextContent(
        fighterType.fighterStats.strength.toString()
      )
      expect(getCellValue(tHeader)).toHaveTextContent(
        fighterType.fighterStats.toughness.toString()
      )
      expect(getCellValue(wHeader)).toHaveTextContent(
        fighterType.fighterStats.wounds.toString()
      )
      expect(getCellValue(iHeader)).toHaveTextContent(
        fighterType.fighterStats.initiative.toString()
      )
      expect(getCellValue(aHeader)).toHaveTextContent(
        fighterType.fighterStats.attacks.toString()
      )
      expect(getCellValue(ldHeader)).toHaveTextContent(
        fighterType.fighterStats.leadership.toString()
      )
      expect(getCellValue(clHeader)).toHaveTextContent(
        fighterType.fighterStats.cool.toString()
      )
      expect(getCellValue(wilHeader)).toHaveTextContent(
        fighterType.fighterStats.will.toString()
      )
      expect(getCellValue(intHeader)).toHaveTextContent(
        fighterType.fighterStats.intelligence.toString()
      )
    })
  })

  it('allows creating a fighter category', async () => {
    const factions = [buildFaction(), buildFaction(), buildFaction()]
    const fighterCategories = [
      buildFighterCategory(),
      buildFighterCategory(),
      buildFighterCategory(),
    ]
    const fighterType = buildFighterType({
      faction: factions[1],
      fighterCategory: fighterCategories[1],
    })
    const serverFighterTypes: FighterType[] = []
    server.use(
      rest.get(fighterTypesUrl, (req, res, ctx) => {
        return res(ctx.json(serverFighterTypes))
      }),
      rest.post<CreateFighterTypeDto>(fighterTypesUrl, (req, res, ctx) => {
        const { body: ftDto } = req
        const defaultFighterStats: FighterStats = {
          id: 'abc',
          movement: 1,
          weaponSkill: 1,
          ballisticSkill: 1,
          strength: 1,
          toughness: 1,
          wounds: 1,
          initiative: 1,
          attacks: 1,
          leadership: 1,
          cool: 1,
          will: 1,
          intelligence: 1,
        }
        const faction = factions.find((f) => f.id === ftDto.faction.id)
        const fighterCategory = fighterCategories.find(
          (fc) => fc.id === ftDto.fighterCategory.id
        )
        if (!faction) {
          return res(
            ctx.status(400),
            ctx.json({
              message: `Faction with id ${ftDto.faction.id} not found`,
            })
          )
        }
        if (!fighterCategory) {
          return res(
            ctx.status(400),
            ctx.json({
              message: `Fighter Category with id ${ftDto.fighterCategory.id} not found`,
            })
          )
        }

        const createdFT: FighterType = {
          ...ftDto,
          faction,
          fighterCategory,
          fighterStats: {
            ...defaultFighterStats,
            id: fighterType.fighterStats.id,
          },
          id: fighterType.id,
        }
        serverFighterTypes.push(createdFT)
        return res(ctx.status(201), ctx.json(createdFT))
      }),
      rest.get(factionsUrl, (req, res, ctx) => {
        return res(ctx.json(factions))
      }),
      rest.get(fighterCategoriesUrl, (req, res, ctx) => {
        return res(ctx.json(fighterCategories))
      })
    )

    render(<FighterTypes />)

    userEvent.click(screen.getByRole('button', { name: /add fighter type/i }))

    const modal = screen.getByRole('dialog', { name: /add new fighter type/i })

    await waitForElementToBeRemoved(screen.getAllByText(/loading/i), {
      timeout: 5000,
    })

    userEvent.type(within(modal).getByLabelText(/name/i), fighterType.name)
    userEvent.type(
      within(modal).getByLabelText(/cost/i),
      fighterType.cost.toString()
    )
    const factionsSelect = within(modal).getByLabelText(/faction/i)
    userEvent.selectOptions(
      factionsSelect,
      within(factionsSelect).getByText(fighterType.faction.name)
    )
    const categorySelect = within(modal).getByLabelText(/category/i)
    userEvent.selectOptions(
      categorySelect,
      within(categorySelect).getByText(fighterType.fighterCategory.name)
    )

    userEvent.type(
      within(modal).getByLabelText(/movement/i),
      fighterType.fighterStats.movement.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/weapon skill/i),
      fighterType.fighterStats.weaponSkill.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/ballistic skill/i),
      fighterType.fighterStats.ballisticSkill.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/strength/i),
      fighterType.fighterStats.strength.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/toughness/i),
      fighterType.fighterStats.toughness.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/wounds/i),
      fighterType.fighterStats.wounds.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/initiative/i),
      fighterType.fighterStats.initiative.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/attacks/i),
      fighterType.fighterStats.attacks.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/leadership/i),
      fighterType.fighterStats.leadership.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/cool/i),
      fighterType.fighterStats.cool.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/will/i),
      fighterType.fighterStats.will.toString()
    )
    userEvent.type(
      within(modal).getByLabelText(/intelligence/i),
      fighterType.fighterStats.intelligence.toString()
    )

    userEvent.click(screen.getByRole('button', { name: /add fighter type/i }))

    await waitForElementToBeRemoved(modal)

    expect(screen.getByText(fighterType.name)).toBeInTheDocument()
    const headerRow = screen.getAllByRole('row')[0]
    const getCellValueFactory = buildGetCellValueFactory(headerRow)
    const table = screen.getByRole('table')
    const resultRow = within(
      within(table).getByTestId('table-body')
    ).getAllByRole('row')[0]
    const getCellValue = getCellValueFactory(resultRow)

    const nameHeader = screen.getByRole('columnheader', { name: /name/i })
    expect(getCellValue(nameHeader)).toHaveTextContent(fighterType.name)
    const factionHeader = screen.getByRole('columnheader', { name: /faction/i })
    expect(getCellValue(factionHeader)).toHaveTextContent(
      fighterType.faction.name
    )
    const categoryHeader = screen.getByRole('columnheader', {
      name: /category/i,
    })
    expect(getCellValue(categoryHeader)).toHaveTextContent(
      fighterType.fighterCategory.name
    )
    const costHeader = screen.getByRole('columnheader', { name: /cost/i })
    expect(getCellValue(costHeader)).toHaveTextContent(
      fighterType.cost.toString()
    )
    const mHeader = screen.getByRole('columnheader', { name: /movement/i })
    expect(getCellValue(mHeader)).toHaveTextContent(
      fighterType.fighterStats.movement.toString()
    )
    const wsHeader = screen.getByRole('columnheader', { name: /weapon skill/i })
    expect(getCellValue(wsHeader)).toHaveTextContent(
      fighterType.fighterStats.weaponSkill.toString()
    )
    const bsHeader = screen.getByRole('columnheader', {
      name: /ballistic skill/i,
    })
    expect(getCellValue(bsHeader)).toHaveTextContent(
      fighterType.fighterStats.ballisticSkill.toString()
    )
    const sHeader = screen.getByRole('columnheader', {
      name: /strength/i,
    })
    expect(getCellValue(sHeader)).toHaveTextContent(
      fighterType.fighterStats.strength.toString()
    )
    const tHeader = screen.getByRole('columnheader', {
      name: /toughness/i,
    })
    expect(getCellValue(tHeader)).toHaveTextContent(
      fighterType.fighterStats.toughness.toString()
    )
    const wHeader = screen.getByRole('columnheader', {
      name: /wounds/i,
    })
    expect(getCellValue(wHeader)).toHaveTextContent(
      fighterType.fighterStats.wounds.toString()
    )
    const iHeader = screen.getByRole('columnheader', {
      name: /initiative/i,
    })
    expect(getCellValue(iHeader)).toHaveTextContent(
      fighterType.fighterStats.initiative.toString()
    )
    const aHeader = screen.getByRole('columnheader', {
      name: /attacks/i,
    })
    expect(getCellValue(aHeader)).toHaveTextContent(
      fighterType.fighterStats.attacks.toString()
    )
    const ldHeader = screen.getByRole('columnheader', {
      name: /leadership/i,
    })
    expect(getCellValue(ldHeader)).toHaveTextContent(
      fighterType.fighterStats.leadership.toString()
    )
    const clHeader = screen.getByRole('columnheader', {
      name: /cool/i,
    })
    expect(getCellValue(clHeader)).toHaveTextContent(
      fighterType.fighterStats.cool.toString()
    )
    const wilHeader = screen.getByRole('columnheader', {
      name: /will/i,
    })
    expect(getCellValue(wilHeader)).toHaveTextContent(
      fighterType.fighterStats.will.toString()
    )
    const intHeader = screen.getByRole('columnheader', {
      name: /intelligence/i,
    })
    expect(getCellValue(intHeader)).toHaveTextContent(
      fighterType.fighterStats.intelligence.toString()
    )
  }, 20000)

  it('allows deleting a fighter type', async () => {
    let serverFTs = [buildFighterType(), buildFighterType()]
    const initialFTs = [...serverFTs]
    server.use(
      rest.get(fighterTypesUrl, (req, res, ctx) => {
        return res(ctx.json(serverFTs))
      }),
      rest.delete(`${fighterTypesUrl}/:id`, (req, res, ctx) => {
        const {
          params: { id },
        } = req

        const deletedFC = serverFTs.find((f) => f.id === id)
        serverFTs = serverFTs.filter((f) => f.id !== id)

        return res(ctx.json(deletedFC))
      })
    )

    render(<FighterTypes />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const [ft1, ft2] = initialFTs

    const deleteFT1Button = screen.getByRole('button', {
      name: new RegExp(`${ft1.name}`, 'i'),
    })

    userEvent.click(deleteFT1Button)

    await waitForElementToBeRemoved(deleteFT1Button)

    expect(screen.queryByText(ft1.name)).not.toBeInTheDocument()
    expect(screen.getByText(ft2.name)).toBeInTheDocument()
  })
})
