import { Test, TestingModule } from '@nestjs/testing';
import { FighterTypesController } from './fighter-types.controller';

describe('FighterTypesController', () => {
  let controller: FighterTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FighterTypesController],
    }).compile();

    controller = module.get<FighterTypesController>(FighterTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
