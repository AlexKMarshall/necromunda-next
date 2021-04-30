import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from 'src/prisma/prisma.module'
import { FactionsService } from './factions.service'

describe('FactionsService', () => {
  let service: FactionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FactionsService],
    }).compile()

    service = module.get<FactionsService>(FactionsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
