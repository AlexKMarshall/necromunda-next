import 'test/setupTests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { buildCreateWeaponTypeDto } from 'test/utils/test-factories'
import { WeaponTypesService } from './weapon-types.service'

const resolve = (error: any) => error
let testModule: TestingModule
let weaponTypesService: WeaponTypesService

beforeEach(async () => {
  testModule = await Test.createTestingModule({
    providers: [PrismaService, WeaponTypesService],
  }).compile()

  weaponTypesService = testModule.get<WeaponTypesService>(WeaponTypesService)
})

afterEach(async () => {
  await testModule.close()
})

test('Can create a weapon type', async () => {
  const weaponTypeDto = buildCreateWeaponTypeDto()

  const savedWeaponType = await weaponTypesService.create(weaponTypeDto)

  expect(savedWeaponType).toMatchObject({
    id: expect.any(String),
    name: weaponTypeDto.name,
  })
})

test('Creating weapon type with duplicate name throws 409 error', async () => {
  const weaponTypeDto = buildCreateWeaponTypeDto()

  await weaponTypesService.create(weaponTypeDto)

  const result = await weaponTypesService.create(weaponTypeDto).catch(resolve)
  const errorMessage = result.response.message.replace(
    weaponTypeDto.name,
    '<weapon type name>',
  )

  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A Weapon Type with name \\"<weapon type name>\\" already exists"`,
  )
})
