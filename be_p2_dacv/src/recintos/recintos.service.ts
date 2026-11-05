import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecintoDto } from './dto/create-recinto.dto';
import { UpdateRecintoDto } from './dto/update-recinto.dto';
import { Recinto } from './entities/recinto.entity';

@Injectable()
export class RecintosService {
  constructor(
    @InjectRepository(Recinto)
    private readonly recintoRepository: Repository<Recinto>,
  ) {}

  async create(createRecintoDto: CreateRecintoDto): Promise<Recinto> {
    const existe = await this.recintoRepository.findOneBy({
      nombre: createRecintoDto.nombre,
      ciudad: createRecintoDto.ciudad,
    });
    if (existe) throw new ConflictException('El recinto ya existe en esta ciudad');

    const recinto = new Recinto();
    Object.assign(recinto, createRecintoDto);
    return this.recintoRepository.save(recinto);
  }

  async findAll(): Promise<Recinto[]> {
    return this.recintoRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Recinto> {
    const recinto = await this.recintoRepository.findOne({ where: { id } });
    if (!recinto) throw new NotFoundException('El recinto no existe');
    return recinto;
  }

  async update(id: number, updateRecintoDto: UpdateRecintoDto): Promise<Recinto> {
    const recinto = await this.findOne(id);
    Object.assign(recinto, updateRecintoDto);
    return this.recintoRepository.save(recinto);
  }

  async remove(id: number): Promise<Recinto> {
    const recinto = await this.findOne(id);
    return this.recintoRepository.softRemove(recinto);
  }
}