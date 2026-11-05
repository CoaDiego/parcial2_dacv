import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventosCulturalesService } from './eventos-culturales.service';
import { CreateEventosCulturaleDto } from './dto/create-eventos-culturale.dto';
import { UpdateEventosCulturaleDto } from './dto/update-eventos-culturale.dto';

@Controller('eventos-culturales')
export class EventosCulturalesController {
  constructor(private readonly eventosCulturalesService: EventosCulturalesService) {}

  @Post()
  create(@Body() createEventosCulturaleDto: CreateEventosCulturaleDto) {
    return this.eventosCulturalesService.create(createEventosCulturaleDto);
  }

  @Get()
  findAll() {
    return this.eventosCulturalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventosCulturalesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventosCulturaleDto: UpdateEventosCulturaleDto) {
    return this.eventosCulturalesService.update(+id, updateEventosCulturaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventosCulturalesService.remove(+id);
  }
}
