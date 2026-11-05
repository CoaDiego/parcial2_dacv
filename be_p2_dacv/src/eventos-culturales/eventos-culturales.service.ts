import { Injectable } from '@nestjs/common';
import { CreateEventosCulturaleDto } from './dto/create-eventos-culturale.dto';
import { UpdateEventosCulturaleDto } from './dto/update-eventos-culturale.dto';

@Injectable()
export class EventosCulturalesService {
  create(createEventosCulturaleDto: CreateEventosCulturaleDto) {
    return 'This action adds a new eventosCulturale';
  }

  findAll() {
    return `This action returns all eventosCulturales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventosCulturale`;
  }

  update(id: number, updateEventosCulturaleDto: UpdateEventosCulturaleDto) {
    return `This action updates a #${id} eventosCulturale`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventosCulturale`;
  }
}
