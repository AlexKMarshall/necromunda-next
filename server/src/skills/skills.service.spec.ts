import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { SkillsService } from './skills.service'
import { buildSkill, buildCreateSkillDto } from 'test/utils/mock-factories'

const prismaMockFactory = () => ({
  skill: {
    findMany: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  },
})

let skillsService: SkillsService
let prismaMock: ReturnType<typeof prismaMockFactory>

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      SkillsService,
      { provide: PrismaService, useFactory: prismaMockFactory },
    ],
  }).compile()

  skillsService = module.get<SkillsService>(SkillsService)
  prismaMock = module.get(PrismaService)
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should get skills', async () => {
  const mockSkills = [buildSkill(), buildSkill()]
  const mockFindMany = prismaMock.skill.findMany
  mockFindMany.mockResolvedValueOnce(mockSkills)

  const skills = await skillsService.skills()

  expect(skills).toEqual(mockSkills)
  expect(mockFindMany).toHaveBeenCalledTimes(1)
  expect(mockFindMany).toHaveBeenCalledWith({ include: { type: true } })
})

it('should create skills', async () => {
  const skill = buildSkill()
  const createSkillDto = buildCreateSkillDto(skill)

  const mockCreate = prismaMock.skill.create
  mockCreate.mockResolvedValueOnce(skill)

  const createdSkill = await skillsService.create(createSkillDto)
  expect(createdSkill).toEqual(skill)
  expect(mockCreate).toHaveBeenCalledTimes(1)
})

it('should delete a skill', async () => {
  const mockSkill = buildSkill()

  const mockDelete = prismaMock.skill.delete
  mockDelete.mockResolvedValueOnce(mockSkill)

  const deletedSkill = await skillsService.delete(mockSkill.id)
  expect(deletedSkill).toEqual(mockSkill)
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete).toHaveBeenCalledWith({ where: { id: mockSkill.id } })
})

it('should throw 409 when trying to create duplicate', async () => {
  const createSkillDto = buildCreateSkillDto()
  const mockCreate = prismaMock.skill.create
  mockCreate.mockRejectedValueOnce({ code: 'P2002' })

  const result = await skillsService.create(createSkillDto).catch((e) => e)

  const errorMessage = result.response.message.replace(
    createSkillDto.name,
    '<skill name>',
  )
  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A skill with name \\"<skill name>\\" already exists"`,
  )
})

it('should re-throw unknown database error on create', async () => {
  const skillDto = buildCreateSkillDto()
  const mockCreate = prismaMock.skill.create
  const unknownError = new Error('unknown error')
  mockCreate.mockRejectedValueOnce(unknownError)

  const result = await skillsService.create(skillDto).catch((e) => e)

  expect(result).toEqual(unknownError)
})
