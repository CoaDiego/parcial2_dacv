import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventosCulturaleDto } from './dto/create-eventos-culturale.dto';
import { UpdateEventosCulturaleDto } from './dto/update-eventos-culturale.dto';
import { EventosCulturale } from './entities/eventos-culturale.entity';

@Injectable()
export class EventosCulturalesService {
  constructor(
    @InjectRepository(EventosCulturale)
    private readonly eventosRepository: Repository<EventosCulturale>,
  ) {}

  async create(createDto: CreateEventosCulturaleDto): Promise<EventosCulturale> {
    const evento = new EventosCulturale();
    Object.assign(evento, createDto);
    return this.eventosRepository.save(evento);
  }

  async findAll(): Promise<EventosCulturale[]> {
    return this.eventosRepository.find({
      relations: { recinto: true },
      order: { titulo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EventosCulturale> {
    const evento = await this.eventosRepository.findOne({
      where: { id },
      relations: { recinto: true },
    });
    if (!evento) throw new NotFoundException('El evento cultural no existe');
    return evento;
  }

  async update(id: number, updateDto: UpdateEventosCulturaleDto): Promise<EventosCulturale> {
    const evento = await this.findOne(id);
    Object.assign(evento, updateDto);
    return this.eventosRepository.save(evento);
  }

  async remove(id: number): Promise<EventosCulturale> {
    const evento = await this.findOne(id);
    return this.eventosRepository.softRemove(evento);
  }
}