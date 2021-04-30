import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from 'src/prisma/prisma.module'
import { FactionsController } from './factions.controller'
import { FactionsService } from './factions.service'

describe('FactionsController', () => {
  let controller: FactionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.register()],
      providers: [FactionsService],
      controllers: [FactionsController],
    }).compile()

    controller = module.get<FactionsController>(FactionsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
