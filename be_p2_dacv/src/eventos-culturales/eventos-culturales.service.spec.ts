import { Test, TestingModule } from '@nestjs/testing';
import { EventosCulturalesService } from './eventos-culturales.service';

describe('EventosCulturalesService', () => {
  let service: EventosCulturalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventosCulturalesService],
    }).compile();

    service = module.get<EventosCulturalesService>(EventosCulturalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
