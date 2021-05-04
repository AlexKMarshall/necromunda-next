import { Faction } from '.prisma/client'
import { Test, TestingModule } from '@nestjs/testing'
import * as faker from 'faker'
import { PrismaService } from 'src/prisma/prisma.service'
import { FactionsService } from './factions.service'

function buildFaction(overrides: Partial<Faction> = {}): Faction {
  return {
    id: faker.datatype.uuid(),
    name: faker.company.bsNoun(),
    ...overrides,
  }
}

const prismaMockFactory = () => ({
  faction: {
    findMany: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  },
})

let factionsService: FactionsService
let prismaMock: ReturnType<typeof prismaMockFactory>

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      FactionsService,
      { provide: PrismaService, useFactory: prismaMockFactory },
    ],
  }).compile()

  factionsService = module.get<FactionsService>(FactionsService)
  prismaMock = module.get(PrismaService)
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should get factions', async () => {
  const mockFactions = [buildFaction(), buildFaction()]
  const mockFindMany = prismaMock.faction.findMany
  mockFindMany.mockResolvedValueOnce(mockFactions)

  const factions = await factionsService.factions()

  expect(factions).toEqual(mockFactions)
  expect(mockFindMany).toHaveBeenCalledTimes(1)
  expect(mockFindMany).toHaveBeenCalledWith()
})

it('should create factions', async () => {
  const mockFaction = buildFaction()
  const { name } = mockFaction

  const mockCreate = prismaMock.faction.create
  mockCreate.mockResolvedValueOnce(mockFaction)

  const createdFaction = await factionsService.create({ name })
  expect(createdFaction).toEqual(mockFaction)
  expect(mockCreate).toHaveBeenCalledTimes(1)
  expect(mockCreate).toHaveBeenCalledWith({ data: { name } })
})

it('should delete a faction', async () => {
  const mockFaction = buildFaction()

  const mockDelete = prismaMock.faction.delete
  mockDelete.mockResolvedValueOnce(mockFaction)

  const deletedFaction = await factionsService.delete({ id: mockFaction.id })
  expect(deletedFaction).toEqual(mockFaction)
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete).toHaveBeenCalledWith({ where: { id: mockFaction.id } })
})

it('should throw 409 when trying to create duplicate', async () => {
  const mockFaction = buildFaction()
  const mockCreate = prismaMock.faction.create
  mockCreate.mockRejectedValueOnce({ code: 'P2002' })

  const result = await factionsService.create(mockFaction).catch((e) => e)

  const errorMessage = result.response.message.replace(
    mockFaction.name,
    '<faction name>',
  )
  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A faction with name \\"<faction name>\\" already exists"`,
  )
})

it('should re-throw unknown database error on create', async () => {
  const mockFaction = buildFaction()
  const mockCreate = prismaMock.faction.create
  const unknownError = new Error('unknown error')
  mockCreate.mockRejectedValueOnce(unknownError)

  const result = await factionsService.create(mockFaction).catch((e) => e)

  expect(result).toEqual(unknownError)
})
