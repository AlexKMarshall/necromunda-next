import 'test/setupTests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'

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

test('Can create a fighter category', async () => {
  const fighterCategory = { name: 'Test FC' }

  const savedFC = await prismaService.fighterCategory.create({
    data: fighterCategory,
  })

  expect(savedFC).toMatchObject({
    id: expect.any(String),
    name: fighterCategory.name,
  })
})

test('Creating fighter category with duplicate name throws P2002 error', async () => {
  const fighterCategory = { name: 'A duplicate' }
  await prismaService.fighterCategory.create({ data: fighterCategory })

  const result = await prismaService.fighterCategory
    .create({ data: fighterCategory })
    .catch(resolve)

  expect(result.code).toBe('P2002')
  expect(result.message).toMatchInlineSnapshot(`
    "
    Invalid \`prisma.fighterCategory.create()\` invocation:


      Unique constraint failed on the fields: (\`name\`)"
  `)
})
