import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { WeaponTypesService } from './weapon-types.service'
import {
  buildWeaponType,
  buildCreateWeaponTypeDto,
} from 'test/utils/mock-factories'

const prismaMockFactory = () => ({
  weaponType: {
    findMany: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  },
})

let weaponTypesService: WeaponTypesService
let prismaMock: ReturnType<typeof prismaMockFactory>

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      WeaponTypesService,
      { provide: PrismaService, useFactory: prismaMockFactory },
    ],
  }).compile()

  weaponTypesService = module.get<WeaponTypesService>(WeaponTypesService)
  prismaMock = module.get(PrismaService)
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should get weapon types', async () => {
  const mockWeaponTypes = [buildWeaponType(), buildWeaponType()]
  const mockFindMany = prismaMock.weaponType.findMany
  mockFindMany.mockResolvedValueOnce(mockWeaponTypes)

  const weaponTypes = await weaponTypesService.weaponTypes()

  expect(weaponTypes).toEqual(mockWeaponTypes)
  expect(mockFindMany).toHaveBeenCalledTimes(1)
  expect(mockFindMany).toHaveBeenCalledWith()
})

it('should create weapon types', async () => {
  const weaponType = buildWeaponType()
  const createWeaponTypeDto = buildCreateWeaponTypeDto(weaponType)

  const mockCreate = prismaMock.weaponType.create
  mockCreate.mockResolvedValueOnce(weaponType)

  const createdWeaponType = await weaponTypesService.create(createWeaponTypeDto)
  expect(createdWeaponType).toEqual(weaponType)
  expect(mockCreate).toHaveBeenCalledTimes(1)
})

it('should delete a weapon type', async () => {
  const mockWeaponType = buildWeaponType()

  const mockDelete = prismaMock.weaponType.delete
  mockDelete.mockResolvedValueOnce(mockWeaponType)

  const deletedWeaponType = await weaponTypesService.delete(mockWeaponType.id)
  expect(deletedWeaponType).toEqual(mockWeaponType)
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete).toHaveBeenCalledWith({ where: { id: mockWeaponType.id } })
})

it('should throw 409 when trying to create duplicate', async () => {
  const createSkillDto = buildCreateWeaponTypeDto()
  const mockCreate = prismaMock.weaponType.create
  mockCreate.mockRejectedValueOnce({ code: 'P2002' })

  const result = await weaponTypesService.create(createSkillDto).catch((e) => e)

  const errorMessage = result.response.message.replace(
    createSkillDto.name,
    '<skill name>',
  )
  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A Weapon Type with name \\"<skill name>\\" already exists"`,
  )
})

it('should re-throw unknown database error on create', async () => {
  const skillDto = buildCreateWeaponTypeDto()
  const mockCreate = prismaMock.weaponType.create
  const unknownError = new Error('unknown error')
  mockCreate.mockRejectedValueOnce(unknownError)

  const result = await weaponTypesService.create(skillDto).catch((e) => e)

  expect(result).toEqual(unknownError)
})
