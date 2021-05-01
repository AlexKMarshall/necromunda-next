import { execSync } from 'child_process'
import { Client } from 'pg'

let schema: string
let connectionString: string

beforeEach(async () => {
  // test setup inspired by https://github.com/ctrlplusb/prisma-pg-jest
  schema = `test-${process.env.JEST_WORKER_ID}`
  connectionString = `postgresql://necromunda:my_password@localhost:5432/necromunda?schema=${schema}`
  process.env.DATABASE_URL = connectionString

  const client = new Client({ connectionString: connectionString })
  await client.connect()
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  await client.end()

  const prismaBinary = './node_modules/.bin/prisma'

  execSync(`${prismaBinary} migrate deploy`, {
    env: { ...process.env, DATABASE_URL: connectionString },
  })
})

afterEach(async () => {
  const client = new Client({ connectionString: connectionString })
  await client.connect()
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  await client.end()
})
