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
import FighterTypes from '../pages/admin/fighter-types'
import {
  buildFaction,
  buildFighterCategory,
  buildFighterType,
} from 'test/mocks/test-factories'
import { CreateFighterTypeDto, FighterType } from 'schemas'

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

/** Pass this a header row element to get back a function
 *  that you can call with a data row element to get back
 *  a further function that you can call with a header cell
 *  to get back the cell in the row you're looking at for that column
 *
 *  Essentially a curried version of getCellValue(headerRow, dataRow, columnHeader)
 */
function buildGetCellValueFactory(headerRow: HTMLElement) {
  const headerCellsArray = within(headerRow).getAllByRole('columnheader')
  function getColIndex(headerCell: HTMLElement) {
    return headerCellsArray.indexOf(headerCell)
  }

  return function getCellValueFactory(dataRow: HTMLElement) {
    const dataCells = within(dataRow).getAllByRole('cell')
    return function getCellValue(headerCell: HTMLElement) {
      const colIndex = getColIndex(headerCell)
      return dataCells[colIndex]
    }
  }
}

describe('Fighter Types', () => {
  it('shows a list of fighter types', async () => {
    const fighterTypes = [buildFighterType(), buildFighterType()]
    server.use(
      rest.get('http://localhost:3000/fighter-types', (req, res, ctx) => {
        return res(ctx.json(fighterTypes))
      })
    )

    render(<FighterTypes />, { wrapper: Providers })

    expect(
      screen.getByRole('heading', { name: /fighter types/i })
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
    expect(rows).toHaveLength(fighterTypes.length)

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

    const headerRow = screen.getAllByRole('row')[0]
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
      rest.get('http://localhost:3000/fighter-types', (req, res, ctx) => {
        return res(ctx.json(serverFighterTypes))
      }),
      rest.post<CreateFighterTypeDto>(
        'http://localhost:3000/fighter-types',
        (req, res, ctx) => {
          const {
            body: { name },
          } = req
          const createdFC = { ...fighterType, name }
          serverFighterTypes.push(createdFC)
          return res(ctx.status(201), ctx.json(createdFC))
        }
      ),
      rest.get('http://localhost:3000/factions', (req, res, ctx) => {
        return res(ctx.json(factions))
      }),
      rest.get('http://localhost:3000/fighter-categories', (req, res, ctx) => {
        return res(ctx.json(fighterCategories))
      })
    )

    render(<FighterTypes />, { wrapper: Providers })

    userEvent.click(screen.getByRole('button', { name: /add fighter type/i }))

    expect(
      screen.getByRole('heading', { name: /add new fighter type/i })
    ).toBeInTheDocument()

    userEvent.type(
      screen.getByRole('textbox', { name: /name/i }),
      fighterType.name
    )
  })

  it.skip('allows deleting a fighter type', async () => {
    let serverFTs = [buildFighterType(), buildFighterType()]
    const initialFTs = [...serverFTs]
    server.use(
      rest.get('http://localhost:3000/fighter-types', (req, res, ctx) => {
        return res(ctx.json(serverFTs))
      }),
      rest.delete(
        'http://localhost:3000/fighter-types/:id',
        (req, res, ctx) => {
          const {
            params: { id },
          } = req

          const deletedFC = serverFTs.find((f) => f.id === id)
          serverFTs = serverFTs.filter((f) => f.id !== id)

          return res(ctx.json(deletedFC))
        }
      )
    )

    render(<FighterTypes />, { wrapper: Providers })

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
