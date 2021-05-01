import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { AppModule } from '../src/app.module'

describe('Fighter Categories (e2e)', () => {
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

  it('should CRD a fighter category (FC)', async () => {
    const endpoint = '/fighter-categories'
    const createFCDto = { name: 'Leader' }
    const createResponse = await request.post(endpoint).send(createFCDto)

    const { status: createdStatus, body: createdFC } = createResponse
    expect(createdStatus).toBe(201)
    expect(createdFC).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...createFCDto,
      }),
    )

    const readAfterCreateResponse = await request.get(endpoint)
    const {
      status: readAfterCreateStatus,
      body: readAfterCreateFCs,
    } = readAfterCreateResponse

    expect(readAfterCreateStatus).toBe(200)
    expect(readAfterCreateFCs).toContainEqual(createdFC)
    expect(readAfterCreateFCs).toHaveLength(1)

    const deleteRepsonse = await request.delete(`${endpoint}/${createdFC.id}`)
    const { status: deletedStatus, body: deletedFC } = deleteRepsonse

    expect(deletedStatus).toBe(200)
    expect(deletedFC).toEqual(createdFC)

    const readAfterDeleteResponse = await request.get(endpoint)
    const {
      status: readAfterDeleteStatus,
      body: readAfterDeleteFCs,
    } = readAfterDeleteResponse

    expect(readAfterDeleteStatus).toBe(200)
    expect(readAfterDeleteFCs).toEqual([])
  })
})
