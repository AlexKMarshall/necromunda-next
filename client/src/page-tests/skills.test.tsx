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
import Skills from '../pages/admin/skills'
import { buildSkill, buildSkillType } from 'test/mocks/test-factories'
import { CreateSkillDto, Skill } from 'schemas'
import { apiBaseUrl, endpoints } from 'config'

const skillsUrl = `${apiBaseUrl}/${endpoints.skills}`
const skillTypesUrl = `${apiBaseUrl}/${endpoints.skillTypes}`

describe('Skills', () => {
  it('shows a list of skills', async () => {
    const skills = [buildSkill(), buildSkill()]
    server.use(
      rest.get(skillsUrl, (req, res, ctx) => {
        return res(ctx.json(skills))
      })
    )

    render(<Skills />)

    expect(screen.getByRole('heading', { name: /skills/i })).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const table = screen.getByRole('table')
    const rows = within(within(table).getByTestId('table-body')).getAllByRole(
      'row'
    )
    expect(rows).toHaveLength(skills.length)

    const nameHeader = screen.getByRole('columnheader', { name: /name/i })
    const typeHeader = screen.getByRole('columnheader', { name: /type/i })

    const headerRow = screen.getAllByRole('row')[0]
    const getCellValueFactory = buildGetCellValueFactory(headerRow)

    skills.forEach((skill, index) => {
      const row = rows[index]
      const getCellValue = getCellValueFactory(row)

      expect(getCellValue(nameHeader)).toHaveTextContent(skill.name)
      expect(getCellValue(typeHeader)).toHaveTextContent(skill.type.name)
    })
  })

  it('allows creating a skill', async () => {
    const skillTypes = [buildSkillType(), buildSkillType(), buildSkillType()]
    const skill = buildSkill({ type: skillTypes[1] })
    const serverSkillTypes: Skill[] = []
    server.use(
      rest.get(skillsUrl, (req, res, ctx) => {
        return res(ctx.json(serverSkillTypes))
      }),
      rest.post<CreateSkillDto>(skillsUrl, (req, res, ctx) => {
        const { body: skillDto } = req
        const skillType = skillTypes.find(
          (st) => st.id === skillDto.type.id
        ) ?? { id: '', name: 'pending' }
        const createdSkill = { ...skill, ...skillDto, type: skillType }

        serverSkillTypes.push(createdSkill)
        return res(ctx.status(201), ctx.json(createdSkill))
      }),
      rest.get(skillTypesUrl, (req, res, ctx) => {
        return res(ctx.json(skillTypes))
      })
    )

    render(<Skills />)

    await waitForElementToBeRemoved(screen.getAllByText(/loading/i))

    userEvent.click(screen.getByRole('button', { name: /add skill/i }))

    expect(
      screen.getByRole('heading', { name: /add new skill/i })
    ).toBeInTheDocument()

    await waitForElementToBeRemoved(screen.getAllByText(/loading/i))

    userEvent.type(screen.getByRole('textbox', { name: /name/i }), skill.name)
    userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: skill.type.name })
    )

    userEvent.click(screen.getByRole('button', { name: /add skill/i }))

    await waitForElementToBeRemoved(screen.getByRole('dialog'))

    const newSkillType = await screen.findByRole('cell', {
      name: skill.name,
    })
    expect(newSkillType).toBeInTheDocument()
  })

  it('allows deleting a skill', async () => {
    let serverSkills = [buildSkill(), buildSkill()]
    const initialSkills = [...serverSkills]
    server.use(
      rest.get(skillsUrl, (req, res, ctx) => {
        return res(ctx.json(serverSkills))
      }),
      rest.delete(`${skillsUrl}/:id`, (req, res, ctx) => {
        const {
          params: { id },
        } = req

        const deletedSkills = serverSkills.find((f) => f.id === id)
        serverSkills = serverSkills.filter((f) => f.id !== id)

        return res(ctx.json(deletedSkills))
      })
    )

    render(<Skills />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    const [skill1, skill2] = initialSkills

    const deleteSkill1Button = screen.getByRole('button', {
      name: new RegExp(`${skill1.name}`, 'i'),
    })

    userEvent.click(deleteSkill1Button)

    await waitForElementToBeRemoved(deleteSkill1Button)

    expect(screen.queryByText(skill1.name)).not.toBeInTheDocument()
    expect(screen.getByText(skill2.name)).toBeInTheDocument()
  })
})
