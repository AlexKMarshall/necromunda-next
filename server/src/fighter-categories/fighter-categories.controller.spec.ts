import { Test, TestingModule } from '@nestjs/testing'
import { FighterCategoriesController } from './fighter-categories.controller'

describe('FighterCategoriesController', () => {
  let controller: FighterCategoriesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FighterCategoriesController],
    }).compile()

    controller = module.get<FighterCategoriesController>(
      FighterCategoriesController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
