import 'test/setupTests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { buildCreateTraitDto } from 'test/utils/mock-factories'

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

test('Can create a trait', async () => {
  const trait = buildCreateTraitDto()

  const savedTrait = await prismaService.trait.create({ data: trait })

  expect(savedTrait).toMatchObject({
    id: expect.any(String),
    name: trait.name,
  })
})

test('Creating trait with duplicate name throws P2002 error', async () => {
  const trait = buildCreateTraitDto()
  await prismaService.trait.create({ data: trait })

  const result = await prismaService.trait
    .create({ data: trait })
    .catch(resolve)

  expect(result.code).toBe('P2002')
  expect(result.message).toMatchInlineSnapshot(`
    "
    Invalid \`prisma.trait.create()\` invocation:


      Unique constraint failed on the fields: (\`name\`)"
  `)
})
