import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  buildCreateFactionDTO,
  buildFighterCategory,
} from 'test/utils/mock-factories'
import { FighterCategoriesService } from './fighter-categories.service'

const prismaMockFactory = () => ({
  fighterCategory: {
    findMany: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  },
})

let fighterCategoriesService: FighterCategoriesService
let prismaMock: ReturnType<typeof prismaMockFactory>

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      FighterCategoriesService,
      { provide: PrismaService, useFactory: prismaMockFactory },
    ],
  }).compile()

  fighterCategoriesService = module.get<FighterCategoriesService>(
    FighterCategoriesService,
  )
  prismaMock = module.get(PrismaService)
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should get fighter categories', async () => {
  const mockFighterCategories = [buildFighterCategory(), buildFighterCategory()]
  const mockFindMany = prismaMock.fighterCategory.findMany
  mockFindMany.mockResolvedValueOnce(mockFighterCategories)
  const fighterCategories = await fighterCategoriesService.fighterCategories()
  expect(fighterCategories).toEqual(mockFighterCategories)
  expect(mockFindMany).toHaveBeenCalledTimes(1)
  expect(mockFindMany).toHaveBeenCalledWith()
})

it('should create fighter categories', async () => {
  const fighterCategory = buildFighterCategory()
  const createFCDto = buildCreateFactionDTO(fighterCategory)

  const mockCreate = prismaMock.fighterCategory.create
  mockCreate.mockResolvedValueOnce(fighterCategory)
  const createdFC = await fighterCategoriesService.create(createFCDto)
  expect(createdFC).toEqual(fighterCategory)
  expect(mockCreate).toHaveBeenCalledTimes(1)
  expect(mockCreate).toHaveBeenCalledWith({ data: createFCDto })
})

it('should delete a fighter category', async () => {
  const mockFighterCategory = buildFighterCategory()

  const mockDelete = prismaMock.fighterCategory.delete
  mockDelete.mockResolvedValueOnce(mockFighterCategory)
  const deletedFC = await fighterCategoriesService.delete({
    id: mockFighterCategory.id,
  })
  expect(deletedFC).toEqual(mockFighterCategory)
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete).toHaveBeenCalledWith({
    where: { id: mockFighterCategory.id },
  })
})

it('should throw 409 when trying to create duplicate', async () => {
  const mockFighterCategory = { name: 'faction name' }
  const mockCreate = prismaMock.fighterCategory.create
  mockCreate.mockRejectedValueOnce({ code: 'P2002' })

  const result = await fighterCategoriesService
    .create(mockFighterCategory)
    .catch((e) => e)

  expect(result.response.statusCode).toBe(409)
  expect(result.response.message).toMatchInlineSnapshot(
    `"A fighter category with name \\"faction name\\" already exists"`,
  )
})

it('should re-throw unknown database error on create', async () => {
  const mockFighterCategory = { name: 'fc name' }
  const mockCreate = prismaMock.fighterCategory.create
  const unknownError = new Error('unknown error')
  mockCreate.mockRejectedValueOnce(unknownError)

  const result = await fighterCategoriesService
    .create(mockFighterCategory)
    .catch((e) => e)

  expect(result).toEqual(unknownError)
})
