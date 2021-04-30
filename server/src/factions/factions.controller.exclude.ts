import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from 'src/prisma/prisma.module'
import { FactionsController } from './factions.controller'
import { FactionsService } from './factions.service'
import { promisify } from 'util'
import { exec as nodeExec } from 'child_process'
import { Client } from 'pg'

describe('FactionsController', () => {
  let controller: FactionsController

  let schema: string
  let connectionString: string

  beforeEach(async () => {
    // test setup inspired by https://github.com/ctrlplusb/prisma-pg-jest
    schema = `test-${process.env.JEST_WORKER_ID}`
    connectionString = `postgresql://necromunda:my_password@localhost:5432/necromunda?schema=${schema}`
    process.env.DATABASE_URL = connectionString
    const prismaBinary = './node_modules/.bin/prisma'
    const exec = promisify(nodeExec)

    const migrateResult = await exec(`${prismaBinary} migrate deploy`)
    console.log(migrateResult)

    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FactionsService],
      controllers: [FactionsController],
    }).compile()

    controller = module.get<FactionsController>(FactionsController)
  })

  afterEach(async () => {
    const client = new Client({ connectionString: connectionString })
    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
    await client.end()
  })

  it('should CRD a faction', async () => {
    const initialFactions = await controller.get()

    expect(initialFactions).toEqual([])

    const name = 'Alex'

    const createResult = await controller.create({ name })
    expect(createResult).toMatchObject({ id: expect.any(String), name })

    const createdFactions = await controller.get()
    expect(createdFactions).toEqual([createResult])

    await controller.delete(createResult.id)

    const finalFactions = await controller.get()

    expect(finalFactions).toEqual([])
  })
})
