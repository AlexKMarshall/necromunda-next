import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { SkillTypesService } from './skill-types.service'
import {
  buildSkillType,
  buildCreateSkillTypeDto,
} from 'test/utils/mock-factories'

const prismaMockFactory = () => ({
  skillType: {
    findMany: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  },
})

let skillTypesService: SkillTypesService
let prismaMock: ReturnType<typeof prismaMockFactory>

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      SkillTypesService,
      { provide: PrismaService, useFactory: prismaMockFactory },
    ],
  }).compile()

  skillTypesService = module.get<SkillTypesService>(SkillTypesService)
  prismaMock = module.get(PrismaService)
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should get skill types', async () => {
  const mockSkillTypes = [buildSkillType(), buildSkillType()]
  const mockFindMany = prismaMock.skillType.findMany
  mockFindMany.mockResolvedValueOnce(mockSkillTypes)

  const skillTypes = await skillTypesService.skillTypes()

  expect(skillTypes).toEqual(mockSkillTypes)
  expect(mockFindMany).toHaveBeenCalledTimes(1)
  expect(mockFindMany).toHaveBeenCalledWith()
})

it('should create skill types', async () => {
  const skillType = buildSkillType()
  const createSkillTypeDto = buildCreateSkillTypeDto(skillType)

  const mockCreate = prismaMock.skillType.create
  mockCreate.mockResolvedValueOnce(skillType)

  const createdSkillType = await skillTypesService.create(createSkillTypeDto)
  expect(createdSkillType).toEqual(skillType)
  expect(mockCreate).toHaveBeenCalledTimes(1)
  expect(mockCreate).toHaveBeenCalledWith({ data: createSkillTypeDto })
})

it('should delete a skill type', async () => {
  const mockSkillType = buildSkillType()

  const mockDelete = prismaMock.skillType.delete
  mockDelete.mockResolvedValueOnce(mockSkillType)

  const deletedSkillType = await skillTypesService.delete(mockSkillType.id)
  expect(deletedSkillType).toEqual(mockSkillType)
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete).toHaveBeenCalledWith({ where: { id: mockSkillType.id } })
})

it('should throw 409 when trying to create duplicate', async () => {
  const createSkillTypeDto = buildCreateSkillTypeDto()
  const mockCreate = prismaMock.skillType.create
  mockCreate.mockRejectedValueOnce({ code: 'P2002' })

  const result = await skillTypesService
    .create(createSkillTypeDto)
    .catch((e) => e)

  const errorMessage = result.response.message.replace(
    createSkillTypeDto.name,
    '<skill type name>',
  )
  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A Skill Type with name \\"<skill type name>\\" already exists"`,
  )
})

it('should re-throw unknown database error on create', async () => {
  const skillTypeDto = buildCreateSkillTypeDto()
  const mockCreate = prismaMock.skillType.create
  const unknownError = new Error('unknown error')
  mockCreate.mockRejectedValueOnce(unknownError)

  const result = await skillTypesService.create(skillTypeDto).catch((e) => e)

  expect(result).toEqual(unknownError)
})
