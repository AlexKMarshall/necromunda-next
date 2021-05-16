import 'test/setupTests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  buildCreateSkillDto,
  buildCreateSkillTypeDto,
} from 'test/utils/mock-factories'
import { SkillsService } from './skills.service'

const resolve = (error: any) => error
let testModule: TestingModule
let prismaService: PrismaService
let skillsService: SkillsService

beforeEach(async () => {
  testModule = await Test.createTestingModule({
    providers: [PrismaService, SkillsService],
  }).compile()

  prismaService = testModule.get<PrismaService>(PrismaService)
  skillsService = testModule.get<SkillsService>(SkillsService)
})

afterEach(async () => {
  await testModule.close()
})

test('Can create a skill', async () => {
  const existingSkillType = await prismaService.skillType.create({
    data: buildCreateSkillTypeDto(),
  })
  const skillDto = buildCreateSkillDto({ type: existingSkillType })

  const savedSkill = await skillsService.create(skillDto)

  expect(savedSkill).toMatchObject({
    id: expect.any(String),
    name: skillDto.name,
    type: existingSkillType,
  })
})

test('Creating skill  with duplicate name throws 409 error', async () => {
  const existingSkillType = await prismaService.skillType.create({
    data: buildCreateSkillTypeDto(),
  })
  const skillDto = buildCreateSkillDto({ type: existingSkillType })

  await skillsService.create(skillDto)

  const result = await skillsService.create(skillDto).catch(resolve)
  const errorMessage = result.response.message.replace(
    skillDto.name,
    '<skill name>',
  )

  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A skill with name \\"<skill name>\\" already exists"`,
  )
})
