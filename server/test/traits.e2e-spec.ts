import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { AppModule } from '../src/app.module'
import { buildCreateTraitDto } from './utils/mock-factories'

describe('Traits (e2e)', () => {
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

  it('should CRD a trait', async () => {
    const endpoint = '/traits'
    const createTraitDto = buildCreateTraitDto()
    const createResponse = await request.post(endpoint).send(createTraitDto)

    const { status: createdStatus, body: createdTrait } = createResponse
    expect(createdStatus).toBe(201)
    expect(createdTrait).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...createTraitDto,
      }),
    )

    const readAfterCreateResponse = await request.get(endpoint)
    const {
      status: readAfterCreateStatus,
      body: readAfterCreateTraits,
    } = readAfterCreateResponse

    expect(readAfterCreateStatus).toBe(200)
    expect(readAfterCreateTraits).toContainEqual(createdTrait)
    expect(readAfterCreateTraits).toHaveLength(1)

    const deleteRepsonse = await request.delete(
      `${endpoint}/${createdTrait.id}`,
    )
    const { status: deletedStatus, body: deletedTrait } = deleteRepsonse

    expect(deletedStatus).toBe(200)
    expect(deletedTrait).toEqual(createdTrait)

    const readAfterDeleteResponse = await request.get(endpoint)
    const {
      status: readAfterDeleteStatus,
      body: readAfterDeleteTraits,
    } = readAfterDeleteResponse

    expect(readAfterDeleteStatus).toBe(200)
    expect(readAfterDeleteTraits).toEqual([])
  })
})
