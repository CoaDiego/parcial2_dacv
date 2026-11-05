import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecintosService } from './recintos.service';
import { RecintosController } from './recintos.controller';
import { Recinto } from './entities/recinto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recinto])],
  controllers: [RecintosController],
  providers: [RecintosService],
})
export class RecintosModule {}