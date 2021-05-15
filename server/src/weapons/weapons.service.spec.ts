import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { WeaponsService } from './weapons.service'
import { buildWeapon, buildCreateWeaponDto } from 'test/utils/test-factories'

const prismaMockFactory = () => ({
  weapon: {
    findMany: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  },
})

let weaponsService: WeaponsService
let prismaMock: ReturnType<typeof prismaMockFactory>

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      WeaponsService,
      { provide: PrismaService, useFactory: prismaMockFactory },
    ],
  }).compile()

  weaponsService = module.get<WeaponsService>(WeaponsService)
  prismaMock = module.get(PrismaService)
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should get weapons', async () => {
  const mockWeapons = [buildWeapon(), buildWeapon()]
  const mockFindMany = prismaMock.weapon.findMany
  mockFindMany.mockResolvedValueOnce(mockWeapons)

  const weapons = await weaponsService.weapons()

  expect(weapons).toEqual(mockWeapons)
  expect(mockFindMany).toHaveBeenCalledTimes(1)
  expect(mockFindMany).toHaveBeenCalledWith({
    include: {
      weaponType: true,
      weaponStats: {
        include: {
          traits: {
            include: {
              trait: true,
            },
          },
        },
      },
    },
  })
})

it('should create weapons', async () => {
  const weapon = buildWeapon()
  const createWeaponDto = buildCreateWeaponDto(weapon)

  const mockCreate = prismaMock.weapon.create
  mockCreate.mockResolvedValueOnce(weapon)

  const createdWeapon = await weaponsService.create(createWeaponDto)
  expect(createdWeapon).toEqual(weapon)
  expect(mockCreate).toHaveBeenCalledTimes(1)
})

it('should throw 409 when trying to create duplicate', async () => {
  const createWeaponDto = buildCreateWeaponDto()
  const mockCreate = prismaMock.weapon.create
  mockCreate.mockRejectedValueOnce({ code: 'P2002' })

  const result = await weaponsService.create(createWeaponDto).catch((e) => e)

  const errorMessage = result.response.message.replace(
    createWeaponDto.name,
    '<weapon name>',
  )
  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A weapon with name \\"<weapon name> already exists"`,
  )
})

it('should re-throw unknown database error on create', async () => {
  const weaponDto = buildCreateWeaponDto()
  const mockCreate = prismaMock.weapon.create
  const unknownError = new Error('unknown error')
  mockCreate.mockRejectedValueOnce(unknownError)

  const result = await weaponsService.create(weaponDto).catch((e) => e)

  expect(result).toEqual(unknownError)
})
