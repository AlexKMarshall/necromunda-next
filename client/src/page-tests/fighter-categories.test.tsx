import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
  userEvent,
} from 'test/utils'
import { rest } from 'msw'
import { server } from 'test/mocks/server'
import FighterCategories from '../pages/admin/fighter-categories'
import { buildFighterCategory } from 'test/mocks/test-factories'
import { CreateFighterCategoryDto, FighterCategory } from 'schemas'
import { apiBaseUrl, endpoints } from 'config'

const fighterCategoriesUrl = `${apiBaseUrl}/${endpoints.fighterCategories}`

describe('Fighter Categories', () => {
  it('shows a list of fighter categories', async () => {
    const fighterCategories = [buildFighterCategory(), buildFighterCategory()]
    server.use(
      rest.get(fighterCategoriesUrl, (req, res, ctx) => {
        return res(ctx.json(fighterCategories))
      })
    )

    render(<FighterCategories />)

    expect(
      screen.getByRole('heading', { name: /fighter categories/i })
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

    expect(rows).toHaveLength(fighterCategories.length)
    fighterCategories.forEach((fighterCategory, index) => {
      const row = rows[index]

      expect(within(row).getByText(fighterCategory.name)).toBeInTheDocument()
    })
  })

  it('allows creating a fighter category', async () => {
    const fighterCategory = buildFighterCategory()
    const serverFighterCategories: FighterCategory[] = []
    server.use(
      rest.get(fighterCategoriesUrl, (req, res, ctx) => {
        return res(ctx.json(serverFighterCategories))
      }),
      rest.post<CreateFighterCategoryDto>(
        fighterCategoriesUrl,
        (req, res, ctx) => {
          const {
            body: { name },
          } = req
          const createdFC = { ...fighterCategory, name }
          serverFighterCategories.push(createdFC)
          return res(ctx.status(201), ctx.json(createdFC))
        }
      )
    )

    render(<FighterCategories />)

    userEvent.click(
      screen.getByRole('button', { name: /add fighter category/i })
    )

    expect(
      screen.getByRole('heading', { name: /add new fighter category/i })
    ).toBeInTheDocument()

    userEvent.type(
      screen.getByRole('textbox', { name: /name/i }),
      fighterCategory.name
    )
    userEvent.click(
      screen.getByRole('button', { name: /add fighter category/i })
    )

    await waitForElementToBeRemoved(screen.getByRole('dialog'))

    const newFC = await screen.findByRole('cell', {
      name: fighterCategory.name,
    })
    expect(newFC).toBeInTheDocument()
  })

  it('allows deleting a fighter category', async () => {
    let serverFCs = [buildFighterCategory(), buildFighterCategory()]
    const initialFCs = [...serverFCs]
    server.use(
      rest.get(fighterCategoriesUrl, (req, res, ctx) => {
        return res(ctx.json(serverFCs))
      }),
      rest.delete(`${fighterCategoriesUrl}/:id`, (req, res, ctx) => {
        const {
          params: { id },
        } = req

        const deletedFC = serverFCs.find((f) => f.id === id)
        serverFCs = serverFCs.filter((f) => f.id !== id)

        return res(ctx.json(deletedFC))
      })
    )

    render(<FighterCategories />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const [fc1, fc2] = initialFCs

    const deleteFC1Button = screen.getByRole('button', {
      name: new RegExp(`${fc1.name}`, 'i'),
    })

    userEvent.click(deleteFC1Button)

    await waitForElementToBeRemoved(deleteFC1Button)

    expect(screen.queryByText(fc1.name)).not.toBeInTheDocument()
    expect(screen.getByText(fc2.name)).toBeInTheDocument()
  })
})
