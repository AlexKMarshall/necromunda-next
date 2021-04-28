import { Test, TestingModule } from '@nestjs/testing';
import { FighterTypesService } from './fighter-types.service';

describe('FighterTypesService', () => {
  let service: FighterTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FighterTypesService],
    }).compile();

    service = module.get<FighterTypesService>(FighterTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
