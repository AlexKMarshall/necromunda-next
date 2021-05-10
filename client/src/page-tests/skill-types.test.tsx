import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
  userEvent,
  buildGetCellValueFactory,
} from 'test/utils'
import { rest } from 'msw'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { server } from 'test/mocks/server'
import SkillTypes from '../pages/admin/skill-types'
import { buildSkillType } from 'test/mocks/test-factories'
import { CreateSkillTypeDto, SkillType } from 'schemas'
import { apiBaseUrl, endpoints } from 'config'

const skillTypesUrl = `${apiBaseUrl}/${endpoints.skillTypes}`

describe('Skill Types', () => {
  it('shows a list of skill types', async () => {
    const skillTypes = [buildSkillType(), buildSkillType()]
    server.use(
      rest.get(skillTypesUrl, (req, res, ctx) => {
        return res(ctx.json(skillTypes))
      })
    )

    render(<SkillTypes />)

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

    render(<SkillTypes />)

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

    render(<SkillTypes />)

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
