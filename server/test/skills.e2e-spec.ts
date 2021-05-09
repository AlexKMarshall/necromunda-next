import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { AppModule } from '../src/app.module'
import {
  buildCreateSkillDto,
  buildCreateSkillTypeDto,
} from './utils/mock-factories'
import { SkillTypesService } from 'src/skill-types/skill-types.service'

describe('Skill (e2e)', () => {
  let app: INestApplication
  let request: supertest.SuperTest<supertest.Test>
  let skillTypesService: SkillTypesService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [SkillTypesService],
    }).compile()

    app = moduleFixture.createNestApplication()
    skillTypesService = moduleFixture.get<SkillTypesService>(SkillTypesService)
    await app.init()

    request = await supertest(app.getHttpServer())
  })

  afterEach(async () => {
    await app.close()
  })

  it('should CRD a skill', async () => {
    const endpoint = '/skills'
    const existingSkillType = await skillTypesService.create(
      buildCreateSkillTypeDto(),
    )
    const createSkillDto = buildCreateSkillDto({ type: existingSkillType })
    const createResponse = await request.post(endpoint).send(createSkillDto)

    const { status: createdStatus, body: createdSkill } = createResponse
    expect(createdStatus).toBe(201)
    expect(createdSkill).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...createSkillDto,
        type: existingSkillType,
      }),
    )

    const readAfterCreateResponse = await request.get(endpoint)
    const {
      status: readAfterCreateStatus,
      body: readAfterCreateSkills,
    } = readAfterCreateResponse

    expect(readAfterCreateStatus).toBe(200)
    expect(readAfterCreateSkills).toContainEqual(createdSkill)
    expect(readAfterCreateSkills).toHaveLength(1)

    const deleteRepsonse = await request.delete(
      `${endpoint}/${createdSkill.id}`,
    )
    const { status: deletedStatus, body: deletedSkill } = deleteRepsonse

    expect(deletedStatus).toBe(200)
    expect(deletedSkill).toMatchObject({
      id: createdSkill.id,
      name: createdSkill.name,
    })

    const readAfterDeleteResponse = await request.get(endpoint)
    const {
      status: readAfterDeleteStatus,
      body: readAfterDeleteSkills,
    } = readAfterDeleteResponse

    expect(readAfterDeleteStatus).toBe(200)
    expect(readAfterDeleteSkills).toEqual([])
  })
})
