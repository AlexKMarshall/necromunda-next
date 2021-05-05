import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import { AppModule } from '../src/app.module'
import {
  buildCreateFactionDTO,
  buildCreateFighterTypeDto,
  buildCreateTraitDto,
  buildFaction,
  buildFighterCategory,
} from './utils/mock-factories'
import { FactionsService } from 'src/factions/factions.service'
import { FighterCategoriesService } from 'src/fighter-categories/fighter-categories.service'

describe('Traits (e2e)', () => {
  let app: INestApplication
  let request: supertest.SuperTest<supertest.Test>
  let factionsService: FactionsService
  let fighterCategoriesService: FighterCategoriesService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FactionsService, FighterCategoriesService],
    }).compile()

    app = moduleFixture.createNestApplication()
    factionsService = moduleFixture.get<FactionsService>(FactionsService)
    fighterCategoriesService = moduleFixture.get<FighterCategoriesService>(
      FighterCategoriesService,
    )
    await app.init()

    request = await supertest(app.getHttpServer())
  })

  afterEach(async () => {
    await app.close()
  })

  it('should CRD a fighter type', async () => {
    const endpoint = '/fighter-types'
    const faction = await factionsService.create(buildCreateFactionDTO())
    const fighterCategory = await fighterCategoriesService.create(
      buildFighterCategory(),
    )

    const createFTDto = buildCreateFighterTypeDto({ faction, fighterCategory })
    const createResponse = await request.post(endpoint).send(createFTDto)

    const { status: createdStatus, body: createdFT } = createResponse
    expect(createdStatus).toBe(201)
    expect(createdFT).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...createFTDto,
        fighterStats: {
          ...createFTDto.fighterStats,
          id: expect.any(String),
        },
        faction,
        fighterCategory,
      }),
    )

    const readAfterCreateResponse = await request.get(endpoint)
    const {
      status: readAfterCreateStatus,
      body: readAfterCreateFTs,
    } = readAfterCreateResponse

    expect(readAfterCreateStatus).toBe(200)
    expect(readAfterCreateFTs).toContainEqual(createdFT)
    expect(readAfterCreateFTs).toHaveLength(1)

    const deleteRepsonse = await request.delete(`${endpoint}/${createdFT.id}`)
    const { status: deletedStatus, body: deletedFT } = deleteRepsonse

    expect(deletedStatus).toBe(200)
    expect(deletedFT).toEqual(
      expect.objectContaining({
        id: createdFT.id,
        name: createdFT.name,
      }),
    )

    const readAfterDeleteResponse = await request.get(endpoint)
    const {
      status: readAfterDeleteStatus,
      body: readAfterDeleteFTs,
    } = readAfterDeleteResponse

    expect(readAfterDeleteStatus).toBe(200)
    expect(readAfterDeleteFTs).toEqual([])
  })
})
