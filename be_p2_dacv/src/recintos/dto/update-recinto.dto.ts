import { PartialType } from '@nestjs/swagger';
import { CreateRecintoDto } from './create-recinto.dto';

export class UpdateRecintoDto extends PartialType(CreateRecintoDto) {}