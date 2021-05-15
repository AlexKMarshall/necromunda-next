import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { AppModule } from '../src/app.module'
import {
  buildCreateWeaponDto,
  buildCreateTraitDto,
  buildCreateWeaponTypeDto,
} from './utils/test-factories'
import { WeaponTypesService } from 'src/weapon-types/weapon-types.service'
import { TraitsService } from 'src/traits/traits.service'

describe('Skill (e2e)', () => {
  let app: INestApplication
  let request: supertest.SuperTest<supertest.Test>
  let weaponTypesService: WeaponTypesService
  let traitsService: TraitsService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [WeaponTypesService, TraitsService],
    }).compile()

    app = moduleFixture.createNestApplication()
    weaponTypesService = moduleFixture.get<WeaponTypesService>(
      WeaponTypesService,
    )
    traitsService = moduleFixture.get<TraitsService>(TraitsService)
    await app.init()

    request = await supertest(app.getHttpServer())
  })

  afterEach(async () => {
    await app.close()
  })

  it('should CRD a weapon', async () => {
    const endpoint = '/weapons'
    const existingWeaponType = await weaponTypesService.create(
      buildCreateWeaponTypeDto(),
    )
    const existingTrait = await traitsService.create(buildCreateTraitDto())
    const createWeaponDto = buildCreateWeaponDto({
      weaponType: existingWeaponType,
      weaponStats: [{ traits: [{ trait: existingTrait }] }],
    })
    const createResponse = await request.post(endpoint).send(createWeaponDto)

    const { status: createdStatus, body: createdWeapon } = createResponse

    const {
      weaponStats: [{ traits: traitsDto, ...weaponStatDto }],
    } = createWeaponDto
    const [traitOnWeaponStatDto] = traitsDto

    expect(createdStatus).toBe(201)
    expect(createdWeapon).toMatchObject({
      id: expect.any(String),
      name: createWeaponDto.name,
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

    const readAfterCreateResponse = await request.get(endpoint)
    const {
      status: readAfterCreateStatus,
      body: readAfterCreateWeapons,
    } = readAfterCreateResponse

    expect(readAfterCreateStatus).toBe(200)
    expect(readAfterCreateWeapons).toContainEqual(createdWeapon)
    expect(readAfterCreateWeapons).toHaveLength(1)

    const deleteRepsonse = await request.delete(
      `${endpoint}/${createdWeapon.id}`,
    )
    const { status: deletedStatus, body: deletedWeapon } = deleteRepsonse

    expect(deletedStatus).toBe(200)
    expect(deletedWeapon).toMatchObject({
      id: createdWeapon.id,
      name: createdWeapon.name,
    })

    const readAfterDeleteResponse = await request.get(endpoint)
    const {
      status: readAfterDeleteStatus,
      body: readAfterDeleteWeapons,
    } = readAfterDeleteResponse

    expect(readAfterDeleteStatus).toBe(200)
    expect(readAfterDeleteWeapons).toEqual([])
  })
})
