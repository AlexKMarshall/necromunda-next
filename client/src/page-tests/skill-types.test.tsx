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
import SkillTypes from '../pages/admin/skill-types'
import { buildSkillType } from 'test/mocks/test-factories'
import { CreateSkillTypeDto, SkillType } from 'schemas'
import { apiBaseUrl, endpoints } from 'config'

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

const skillTypesUrl = `${apiBaseUrl}/${endpoints.skillTypes}`

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

describe('Skill Types', () => {
  it('shows a list of skill types', async () => {
    const skillTypes = [buildSkillType(), buildSkillType()]
    server.use(
      rest.get(skillTypesUrl, (req, res, ctx) => {
        return res(ctx.json(skillTypes))
      })
    )

    render(<SkillTypes />, { wrapper: Providers })

    expect(
      screen.getByRole('heading', { name: /skill types/i })
    ).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const table = screen.getByRole('table')
    const rows = within(within(table).getByTestId('table-body')).getAllByRole(
      'row'
    )
    expect(rows).toHaveLength(skillTypes.length)

    const nameHeader = screen.getByRole('columnheader', { name: /name/i })

    const headerRow = screen.getAllByRole('row')[0]
    const getCellValueFactory = buildGetCellValueFactory(headerRow)

    skillTypes.forEach((skillType, index) => {
      const row = rows[index]
      const getCellValue = getCellValueFactory(row)

      expect(getCellValue(nameHeader)).toHaveTextContent(skillType.name)
    })
  })

  it('allows creating a skill type', async () => {
    const skillType = buildSkillType()
    const serverSkillTypes: SkillType[] = []
    server.use(
      rest.get(skillTypesUrl, (req, res, ctx) => {
        return res(ctx.json(serverSkillTypes))
      }),
      rest.post<CreateSkillTypeDto>(skillTypesUrl, (req, res, ctx) => {
        const {
          body: { name },
        } = req
        const createdSkillType = { ...skillType, name }
        serverSkillTypes.push(createdSkillType)
        return res(ctx.status(201), ctx.json(createdSkillType))
      })
    )

    render(<SkillTypes />, { wrapper: Providers })

    userEvent.click(screen.getByRole('button', { name: /add skill type/i }))

    expect(
      screen.getByRole('heading', { name: /add new skill type/i })
    ).toBeInTheDocument()

    userEvent.type(
      screen.getByRole('textbox', { name: /name/i }),
      skillType.name
    )
    userEvent.click(screen.getByRole('button', { name: /add skill type/i }))

    await waitForElementToBeRemoved(screen.getByRole('dialog'))

    const newSkillType = await screen.findByRole('cell', {
      name: skillType.name,
    })
    expect(newSkillType).toBeInTheDocument()
  })

  it('allows deleting a skill type', async () => {
    let serverSkillTypes = [buildSkillType(), buildSkillType()]
    const initialSkillTypes = [...serverSkillTypes]
    server.use(
      rest.get(skillTypesUrl, (req, res, ctx) => {
        return res(ctx.json(serverSkillTypes))
      }),
      rest.delete(`${skillTypesUrl}/:id`, (req, res, ctx) => {
        const {
          params: { id },
        } = req

        const deletedSkillType = serverSkillTypes.find((f) => f.id === id)
        serverSkillTypes = serverSkillTypes.filter((f) => f.id !== id)

        return res(ctx.json(deletedSkillType))
      })
    )

    render(<SkillTypes />, { wrapper: Providers })

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const [skillType1, skillType2] = initialSkillTypes

    const deleteSkillType1Button = screen.getByRole('button', {
      name: new RegExp(`${skillType1.name}`, 'i'),
    })

    userEvent.click(deleteSkillType1Button)

    await waitForElementToBeRemoved(deleteSkillType1Button)

    expect(screen.queryByText(skillType1.name)).not.toBeInTheDocument()
    expect(screen.getByText(skillType2.name)).toBeInTheDocument()
  })
})
