import { Test, TestingModule } from '@nestjs/testing'
import { FighterCategoriesService } from './fighter-categories.service'

describe('FighterCategoriesService', () => {
  let service: FighterCategoriesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FighterCategoriesService],
    }).compile()

    service = module.get<FighterCategoriesService>(FighterCategoriesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
