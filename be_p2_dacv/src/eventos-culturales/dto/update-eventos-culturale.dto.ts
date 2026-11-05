import { PartialType } from '@nestjs/swagger';
import { CreateEventosCulturaleDto } from './create-eventos-culturale.dto';

export class UpdateEventosCulturaleDto extends PartialType(CreateEventosCulturaleDto) {}