import 'test/setupTests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { FighterTypesService } from './fighter-types.service'
import {
  buildCreateFactionDTO,
  buildCreateFighterCategoryDto,
  buildCreateFighterTypeDto,
} from 'test/utils/mock-factories'

const resolve = (error: any) => error
let testModule: TestingModule
let prismaService: PrismaService
let fighterTypesService: FighterTypesService

beforeEach(async () => {
  testModule = await Test.createTestingModule({
    providers: [PrismaService, FighterTypesService],
  }).compile()

  prismaService = testModule.get<PrismaService>(PrismaService)
  fighterTypesService = testModule.get<FighterTypesService>(FighterTypesService)
})

afterEach(async () => {
  await testModule.close()
})

test('Can create a fighter type', async () => {
  const existingFaction = await prismaService.faction.create({
    data: buildCreateFactionDTO(),
  })
  const existingFighterCategory = await prismaService.fighterCategory.create({
    data: buildCreateFighterCategoryDto(),
  })

  const ftDto = buildCreateFighterTypeDto({
    faction: existingFaction,
    fighterCategory: existingFighterCategory,
  })

  const savedFT = await fighterTypesService.create(ftDto)

  expect(savedFT).toMatchObject({
    id: expect.any(String),
    name: savedFT.name,
    faction: existingFaction,
    fighterCategory: existingFighterCategory,
    fighterStats: expect.objectContaining({
      ...ftDto.fighterStats,
      id: expect.any(String),
    }),
  })
})

test('Creating fighter type with duplicate name throws 409 error', async () => {
  const existingFaction = await prismaService.faction.create({
    data: buildCreateFactionDTO(),
  })
  const existingFighterCategory = await prismaService.fighterCategory.create({
    data: buildCreateFighterCategoryDto(),
  })

  const ftDto = buildCreateFighterTypeDto({
    faction: existingFaction,
    fighterCategory: existingFighterCategory,
  })
  await fighterTypesService.create(ftDto)

  const result = await fighterTypesService.create(ftDto).catch(resolve)

  const errorMessage = result.response.message.replace(
    ftDto.name,
    '<fighter type name>',
  )

  expect(result.response.statusCode).toBe(409)
  expect(errorMessage).toMatchInlineSnapshot(
    `"A fighter type with name \\"<fighter type name> already exists"`,
  )
})
