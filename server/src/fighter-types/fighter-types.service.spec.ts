import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  buildCreateFighterTypeDto,
  buildFighterType,
} from 'test/utils/mock-factories'
import { FighterTypesService } from './fighter-types.service'

const prismaMockFactory = () => ({
  fighterType: {
    findMany: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  },
})

let fighterTypesService: FighterTypesService
let prismaMock: ReturnType<typeof prismaMockFactory>

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      FighterTypesService,
      { provide: PrismaService, useFactory: prismaMockFactory },
    ],
  }).compile()

  fighterTypesService = module.get<FighterTypesService>(FighterTypesService)
  prismaMock = module.get(PrismaService)
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should get fighter types', async () => {
  const mockFighterTypes = [buildFighterType(), buildFighterType()]
  const mockFindMany = prismaMock.fighterType.findMany
  mockFindMany.mockResolvedValueOnce(mockFighterTypes)
  const fighterTypes = await fighterTypesService.fighterTypes()
  expect(fighterTypes).toEqual(mockFighterTypes)
  expect(mockFindMany).toHaveBeenCalledTimes(1)
  expect(mockFindMany).toHaveBeenCalledWith()
})

it('should create fighter types', async () => {
  const fighterType = buildFighterType()
  const createFTDto = buildCreateFighterTypeDto(fighterType)

  const mockCreate = prismaMock.fighterType.create
  mockCreate.mockResolvedValueOnce(fighterType)

  const createdFT = await fighterTypesService.create(createFTDto)
  expect(createdFT).toEqual(fighterType)
  expect(mockCreate).toHaveBeenCalledTimes(1)
})

it('should delete a fighter type', async () => {
  const mockFighterType = buildFighterType()

  const mockDelete = prismaMock.fighterType.delete
  mockDelete.mockResolvedValueOnce(mockFighterType)

  const deletedFT = await fighterTypesService.delete({ id: mockFighterType.id })
  expect(deletedFT).toEqual(mockFighterType)
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete).toHaveBeenCalledWith({ where: { id: mockFighterType.id } })
})

it('should throw 409 when trying to create duplicate', async () => {
  const fighterType = buildFighterType()
  const mockCreate = prismaMock.fighterType.create
  mockCreate.mockRejectedValueOnce({ code: 'P2002' })

  const result = await fighterTypesService.create(fighterType).catch((e) => e)

  const errorMessage = result.response.message.replace(
    fighterType.name,
    '<fighter type name>',
  )

  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A fighter type with name \\"<fighter type name> already exists"`,
  )
})

it('should re-throw unknown database error on create', async () => {
  const mockFighterType = buildCreateFighterTypeDto()
  const mockCreate = prismaMock.fighterType.create
  const unknownError = new Error('unkown error')
  mockCreate.mockRejectedValueOnce(unknownError)

  const result = await fighterTypesService
    .create(mockFighterType)
    .catch((e) => e)

  expect(result).toEqual(unknownError)
})
