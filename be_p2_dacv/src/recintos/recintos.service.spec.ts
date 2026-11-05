import { Test, TestingModule } from '@nestjs/testing';
import { RecintosService } from './recintos.service';

describe('RecintosService', () => {
  let service: RecintosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecintosService],
    }).compile();

    service = module.get<RecintosService>(RecintosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
