import { Test, TestingModule } from '@nestjs/testing';
import { AutoresponderController } from './autoresponder.controller';

describe('AutoresponderController', () => {
  let controller: AutoresponderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoresponderController],
    }).compile();

    controller = module.get<AutoresponderController>(AutoresponderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
