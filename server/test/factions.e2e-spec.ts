import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { promisify } from 'util'
import { exec as nodeExec } from 'child_process'
import { Client } from 'pg'
import { AppModule } from '../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  let schema: string
  let connectionString: string

  let request: supertest.SuperTest<supertest.Test>

  beforeEach(async () => {
    // test setup inspired by https://github.com/ctrlplusb/prisma-pg-jest
    schema = `test-${process.env.JEST_WORKER_ID}`
    connectionString = `postgresql://necromunda:my_password@localhost:5432/necromunda?schema=${schema}`
    process.env.DATABASE_URL = connectionString
    const prismaBinary = './node_modules/.bin/prisma'
    const exec = promisify(nodeExec)

    await exec(`${prismaBinary} migrate deploy`)

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    request = await supertest(app.getHttpServer())
  })

  afterEach(async () => {
    await app.close()

    const client = new Client({ connectionString: connectionString })
    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
    await client.end()
  })

  describe('CRUD Factions', () => {
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
})
