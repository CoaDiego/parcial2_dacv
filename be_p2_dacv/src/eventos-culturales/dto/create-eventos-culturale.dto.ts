import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateEventosCulturaleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El ID del recinto es obligatorio' })
  @IsInt({ message: 'El ID del recinto debe ser un número entero' })
  readonly idRecinto: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El título no puede tener más de 150 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly titulo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El artista principal es obligatorio' })
  @IsString({ message: 'El artista principal debe ser texto' })
  @MaxLength(100, { message: 'El artista principal no puede tener más de 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly artistaPrincipal: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La duración es obligatoria' })
  @IsInt({ message: 'La duración debe ser un número entero' })
  readonly duracionMinutos: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El precio de la entrada es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  readonly precioEntrada: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'La fecha del evento es obligatoria' })
  @IsDateString({}, { message: 'La fecha del evento debe ser una fecha válida' })
  readonly fechaEvento: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsString({ message: 'El estado debe ser texto' })
  @MaxLength(20, { message: 'El estado no puede tener más de 20 caracteres' })
  readonly estado: string;
}