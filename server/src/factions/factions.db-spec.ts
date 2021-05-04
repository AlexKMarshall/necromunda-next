import 'test/setupTests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { buildCreateFactionDTO } from 'test/utils/mock-factories'

const resolve = (error: any) => error
let testModule: TestingModule
let prismaService: PrismaService

beforeEach(async () => {
  testModule = await Test.createTestingModule({
    providers: [PrismaService],
  }).compile()

  prismaService = testModule.get<PrismaService>(PrismaService)
})

afterEach(async () => {
  await testModule.close()
})

test('Can create a faction', async () => {
  const faction = buildCreateFactionDTO()

  const savedFaction = await prismaService.faction.create({ data: faction })

  expect(savedFaction).toMatchObject({
    id: expect.any(String),
    name: faction.name,
  })
})

test('Creating faction with duplicate name throws P2002 error', async () => {
  const faction = buildCreateFactionDTO()
  // create it once
  await prismaService.faction.create({ data: faction })

  // create it again
  const result = await prismaService.faction
    .create({ data: faction })
    .catch(resolve)

  expect(result.code).toBe('P2002')
  expect(result.message).toMatchInlineSnapshot(`
    "
    Invalid \`prisma.faction.create()\` invocation:


      Unique constraint failed on the fields: (\`name\`)"
  `)
})
