import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { buildCreateTraitDto, buildTrait } from 'test/utils/test-factories'
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
  const mockTraits = [buildTrait(), buildTrait()]
  const mockFindMany = prismaMock.trait.findMany
  mockFindMany.mockResolvedValueOnce(mockTraits)

  const traits = await traitsService.traits()
  expect(traits).toEqual(mockTraits)
  expect(mockFindMany).toHaveBeenCalledTimes(1)
  expect(mockFindMany).toHaveBeenCalledWith()
})

it('should create traits', async () => {
  const mockTrait = buildTrait()
  const createTraitDto = buildCreateTraitDto(mockTrait)

  const mockCreate = prismaMock.trait.create
  mockCreate.mockResolvedValueOnce(mockTrait)
  const createdTrait = await traitsService.create(createTraitDto)
  expect(createdTrait).toEqual(mockTrait)
  expect(mockCreate).toHaveBeenCalledTimes(1)
  expect(mockCreate).toHaveBeenCalledWith({ data: createTraitDto })
})

it('should delete a trait', async () => {
  const mockTrait = buildTrait()

  const mockDelete = prismaMock.trait.delete
  mockDelete.mockResolvedValueOnce(mockTrait)
  const deletedTrait = await traitsService.delete({ id: mockTrait.id })
  expect(deletedTrait).toEqual(mockTrait)
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete).toHaveBeenCalledWith({ where: { id: mockTrait.id } })
})

it('should throw 409 when trying to create duplicate', async () => {
  const mockTrait = buildCreateTraitDto()
  const mockCreate = prismaMock.trait.create
  mockCreate.mockRejectedValueOnce({ code: 'P2002' })

  const result = await traitsService.create(mockTrait).catch((e) => e)

  const errorMessage = result.response.message.replace(
    mockTrait.name,
    '<trait name>',
  )

  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A trait with name \\"<trait name>\\" already exists"`,
  )
})

it('should re-throw unknown database error on create', async () => {
  const mockTrait = buildCreateTraitDto()
  const mockCreate = prismaMock.trait.create
  const unknownError = new Error('unknown error')
  mockCreate.mockRejectedValueOnce(unknownError)

  const result = await traitsService.create(mockTrait).catch((e) => e)

  expect(result).toEqual(unknownError)
})
