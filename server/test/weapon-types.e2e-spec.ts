import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { AppModule } from '../src/app.module'
import { buildCreateWeaponTypeDto } from './utils/mock-factories'

describe('Weapon Type (e2e)', () => {
  let app: INestApplication
  let request: supertest.SuperTest<supertest.Test>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    request = await supertest(app.getHttpServer())
  })

  afterEach(async () => {
    await app.close()
  })

  it('should CRD a weapon type', async () => {
    const endpoint = '/weapon-types'
    const createWeaponTypeDto = buildCreateWeaponTypeDto()
    const createResponse = await request
      .post(endpoint)
      .send(createWeaponTypeDto)

    const { status: createdStatus, body: createdWeaponType } = createResponse
    expect(createdStatus).toBe(201)
    expect(createdWeaponType).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...createWeaponTypeDto,
      }),
    )

    const readAfterCreateResponse = await request.get(endpoint)
    const {
      status: readAfterCreateStatus,
      body: readAfterCreateWeaponTypes,
    } = readAfterCreateResponse

    expect(readAfterCreateStatus).toBe(200)
    expect(readAfterCreateWeaponTypes).toContainEqual(createdWeaponType)
    expect(readAfterCreateWeaponTypes).toHaveLength(1)

    const deleteRepsonse = await request.delete(
      `${endpoint}/${createdWeaponType.id}`,
    )
    const { status: deletedStatus, body: deletedWeaponType } = deleteRepsonse

    expect(deletedStatus).toBe(200)
    expect(deletedWeaponType).toEqual(createdWeaponType)

    const readAfterDeleteResponse = await request.get(endpoint)
    const {
      status: readAfterDeleteStatus,
      body: readAfterDeleteWeaponTypes,
    } = readAfterDeleteResponse

    expect(readAfterDeleteStatus).toBe(200)
    expect(readAfterDeleteWeaponTypes).toEqual([])
  })
})
