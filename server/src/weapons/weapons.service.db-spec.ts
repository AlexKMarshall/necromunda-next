import 'test/setupTests'
import { Test, TestingModule } from '@nestjs/testing'
import {
  buildCreateWeaponDto,
  buildCreateWeaponTypeDto,
  buildCreateTraitDto,
} from 'test/utils/test-factories'
import { WeaponsService } from './weapons.service'
import { WeaponTypesService } from 'src/weapon-types/weapon-types.service'
import { TraitsService } from 'src/traits/traits.service'
import { PrismaService } from 'src/prisma/prisma.service'

const resolve = (error: any) => error
let testModule: TestingModule
let weaponsService: WeaponsService
let weaponTypesService: WeaponTypesService
let traitsService: TraitsService

beforeEach(async () => {
  testModule = await Test.createTestingModule({
    providers: [
      WeaponsService,
      WeaponTypesService,
      TraitsService,
      PrismaService,
    ],
  }).compile()

  weaponsService = testModule.get<WeaponsService>(WeaponsService)
  weaponTypesService = testModule.get<WeaponTypesService>(WeaponTypesService)
  traitsService = testModule.get<TraitsService>(TraitsService)
})

afterEach(async () => {
  await testModule.close()
})

test('Can create a weapon', async () => {
  const existingWeaponType = await weaponTypesService.create(
    buildCreateWeaponTypeDto(),
  )
  const existingTrait = await traitsService.create(buildCreateTraitDto())

  const weaponDto = buildCreateWeaponDto({
    weaponType: existingWeaponType,
    weaponStats: [{ traits: [{ trait: existingTrait }] }],
  })

  const weapon = await weaponsService.create(weaponDto)

  const {
    weaponStats: [{ traits: traitsDto, ...weaponStatDto }],
  } = weaponDto
  const [traitOnWeaponStatDto] = traitsDto

  expect(weapon).toMatchObject({
    id: expect.any(String),
    name: weaponDto.name,
    weaponType: existingWeaponType,
    weaponStats: expect.arrayContaining([
      expect.objectContaining({
        ...weaponStatDto,
        weaponId: expect.any(String),
        traits: expect.arrayContaining([
          expect.objectContaining({
            ...traitOnWeaponStatDto,
            trait: existingTrait,
            traitId: existingTrait.id,
            weaponStatsId: expect.any(String),
          }),
        ]),
      }),
    ]),
  })
})

it('should delete a weapon', async () => {
  const existingWeaponType = await weaponTypesService.create(
    buildCreateWeaponTypeDto(),
  )
  const existingTrait = await traitsService.create(buildCreateTraitDto())

  const weapon = await weaponsService.create(
    buildCreateWeaponDto({
      weaponType: existingWeaponType,
      weaponStats: [{ traits: [{ trait: existingTrait }] }],
    }),
  )

  const deletedWeapon = await weaponsService.delete(weapon.id)
  expect(deletedWeapon).toEqual(
    expect.objectContaining({
      id: weapon.id,
      name: weapon.name,
    }),
  )
})

test('Creating weapon with duplicate name throws 409 error', async () => {
  const existingWeaponType = await weaponTypesService.create(
    buildCreateWeaponTypeDto(),
  )
  const existingTrait = await traitsService.create(buildCreateTraitDto())
  const weaponDto = buildCreateWeaponDto({
    weaponType: existingWeaponType,
    weaponStats: [{ traits: [{ trait: existingTrait }] }],
  })

  await weaponsService.create(weaponDto)

  const result = await weaponsService.create(weaponDto).catch(resolve)
  const errorMessage = result.response.message.replace(
    weaponDto.name,
    '<weapon name>',
  )

  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A weapon with name \\"<weapon name> already exists"`,
  )
})
