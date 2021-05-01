import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { AppModule } from '../src/app.module'

describe('Factions (e2e)', () => {
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

  it('should CRD a faction', async () => {
    const endpoint = '/factions'
    const createFactionDto = { name: 'Goliath' }
    const createResponse = await request.post(endpoint).send(createFactionDto)

    const { status: createdStatus, body: createdFaction } = createResponse
    expect(createdStatus).toBe(201)
    expect(createdFaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...createFactionDto,
      }),
    )

    const readAfterCreateResponse = await request.get(endpoint)
    const {
      status: readAfterCreateStatus,
      body: readAfterCreateFactions,
    } = readAfterCreateResponse

    expect(readAfterCreateStatus).toBe(200)
    expect(readAfterCreateFactions).toContainEqual(createdFaction)
    expect(readAfterCreateFactions).toHaveLength(1)

    const deleteRepsonse = await request.delete(
      `${endpoint}/${createdFaction.id}`,
    )
    const { status: deletedStatus, body: deletedFaction } = deleteRepsonse

    expect(deletedStatus).toBe(200)
    expect(deletedFaction).toEqual(createdFaction)

    const readAfterDeleteResponse = await request.get(endpoint)
    const {
      status: readAfterDeleteStatus,
      body: readAfterDeleteFactions,
    } = readAfterDeleteResponse

    expect(readAfterDeleteStatus).toBe(200)
    expect(readAfterDeleteFactions).toEqual([])
  })
})
