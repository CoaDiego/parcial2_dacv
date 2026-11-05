import { Test, TestingModule } from '@nestjs/testing';
import { RecintosController } from './recintos.controller';
import { RecintosService } from './recintos.service';

describe('RecintosController', () => {
  let controller: RecintosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecintosController],
      providers: [RecintosService],
    }).compile();

    controller = module.get<RecintosController>(RecintosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
