import { Test, TestingModule } from '@nestjs/testing';
import { AutoresponderService } from './autoresponder.service';

describe('AutoresponderService', () => {
  let service: AutoresponderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoresponderService],
    }).compile();

    service = module.get<AutoresponderService>(AutoresponderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
