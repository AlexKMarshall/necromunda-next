import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { TraitsService } from './traits.service'

const prismaMockFactory = () => ({
  trait: {
    findMany: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  },
})

let traitsService: TraitsService
let prismaMock: ReturnType<typeof prismaMockFactory>

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      TraitsService,
      { provide: PrismaService, useFactory: prismaMockFactory },
    ],
  }).compile()

  traitsService = module.get<TraitsService>(TraitsService)
  prismaMock = module.get(PrismaService)
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should get traits', async () => {
  const mockTraits = [
    { id: '1', name: 'Name 1' },
    { id: '2', name: 'Name 2' },
  ]
  const mockFindMany = prismaMock.trait.findMany
  mockFindMany.mockResolvedValueOnce(mockTraits)
  const traits = await traitsService.traits()
  expect(traits).toEqual(mockTraits)
  expect(mockFindMany).toHaveBeenCalledTimes(1)
  expect(mockFindMany).toHaveBeenCalledWith()
})

it('should create traits', async () => {
  const name = 'Name 1'
  const mockTrait = { id: '1', name }

  const mockCreate = prismaMock.trait.create
  mockCreate.mockResolvedValueOnce(mockTrait)
  const createdTrait = await traitsService.create({ name })
  expect(createdTrait).toEqual(mockTrait)
  expect(mockCreate).toHaveBeenCalledTimes(1)
  expect(mockCreate).toHaveBeenCalledWith({ data: { name } })
})

it('should delete a trait', async () => {
  const mockTrait = { id: '1', name: 'name 1' }

  const mockDelete = prismaMock.trait.delete
  mockDelete.mockResolvedValueOnce(mockTrait)
  const deletedTrait = await traitsService.delete({ id: mockTrait.id })
  expect(deletedTrait).toEqual(mockTrait)
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete).toHaveBeenCalledWith({ where: { id: mockTrait.id } })
})

it('should throw 409 when trying to create duplicate', async () => {
  const mockTrait = { name: 'trait name' }
  const mockCreate = prismaMock.trait.create
  mockCreate.mockRejectedValueOnce({ code: 'P2002' })

  const result = await traitsService.create(mockTrait).catch((e) => e)

  expect(result.response.statusCode).toBe(409)
  expect(result.response.message).toMatchInlineSnapshot(
    `"A trait with name \\"trait name\\" already exists"`,
  )
})

it('should re-throw unknown database error on create', async () => {
  const mockTrait = { name: 'trait name' }
  const mockCreate = prismaMock.trait.create
  const unknownError = new Error('unknown error')
  mockCreate.mockRejectedValueOnce(unknownError)

  const result = await traitsService.create(mockTrait).catch((e) => e)

  expect(result).toEqual(unknownError)
})
