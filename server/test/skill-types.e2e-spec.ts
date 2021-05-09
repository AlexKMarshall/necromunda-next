import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { AppModule } from '../src/app.module'
import { buildCreateSkillTypeDto } from './utils/mock-factories'

describe('Skill Type (e2e)', () => {
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

  it('should CRD a skill type', async () => {
    const endpoint = '/skill-types'
    const createSkillTypeDto = buildCreateSkillTypeDto()
    const createResponse = await request.post(endpoint).send(createSkillTypeDto)

    const { status: createdStatus, body: createdSkillType } = createResponse
    expect(createdStatus).toBe(201)
    expect(createdSkillType).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...createSkillTypeDto,
      }),
    )

    const readAfterCreateResponse = await request.get(endpoint)
    const {
      status: readAfterCreateStatus,
      body: readAfterCreateSkillTypes,
    } = readAfterCreateResponse

    expect(readAfterCreateStatus).toBe(200)
    expect(readAfterCreateSkillTypes).toContainEqual(createdSkillType)
    expect(readAfterCreateSkillTypes).toHaveLength(1)

    const deleteRepsonse = await request.delete(
      `${endpoint}/${createdSkillType.id}`,
    )
    const { status: deletedStatus, body: deletedSkillType } = deleteRepsonse

    expect(deletedStatus).toBe(200)
    expect(deletedSkillType).toEqual(createdSkillType)

    const readAfterDeleteResponse = await request.get(endpoint)
    const {
      status: readAfterDeleteStatus,
      body: readAfterDeleteSkillTypes,
    } = readAfterDeleteResponse

    expect(readAfterDeleteStatus).toBe(200)
    expect(readAfterDeleteSkillTypes).toEqual([])
  })
})
