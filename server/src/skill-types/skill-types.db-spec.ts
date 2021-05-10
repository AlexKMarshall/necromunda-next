import 'test/setupTests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { buildCreateSkillTypeDto } from 'test/utils/mock-factories'

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

test('Can create a skill type', async () => {
  const skillType = buildCreateSkillTypeDto()

  const savedSkillType = await prismaService.skillType.create({
    data: skillType,
  })

  expect(savedSkillType).toMatchObject({
    id: expect.any(String),
    name: skillType.name,
  })
})

test('Creating skill type with duplicate name throws P2002 error', async () => {
  const skillType = buildCreateSkillTypeDto()
  // create it once
  await prismaService.skillType.create({ data: skillType })

  // create it again
  const result = await prismaService.skillType
    .create({ data: skillType })
    .catch(resolve)

  expect(result.code).toBe('P2002')
  expect(result.message).toMatchInlineSnapshot(`
    "
    Invalid \`prisma.skillType.create()\` invocation:


      Unique constraint failed on the fields: (\`name\`)"
  `)
})
