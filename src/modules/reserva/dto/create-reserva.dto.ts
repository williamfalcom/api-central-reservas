import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Reserva } from '../entities/reserva.entity';

let minDataCheckIn = new Date();
minDataCheckIn.setDate(minDataCheckIn.getDate() + 1);

export class CreateReservaDto extends Reserva {
  @ApiProperty({ readOnly: true, required: false })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    type: Date,
    description: 'Data hora de criação de registro.',
    example: '2022-07-31T02:58:33.590Z',
    required: false,
    readOnly: true,
  })
  @IsDateString()
  @IsOptional()
  createdAt?: string | Date;

  @ApiProperty({
    type: Date,
    description: 'Data hora de atualização de registro.',
    example: '2022-07-31T02:58:33.590Z',
    required: false,
    readOnly: true,
  })
  @IsDateString()
  @IsOptional()
  updatedAt?: string | Date;

  @ApiProperty({
    type: String,
    description: 'Nome do paratamento reservado.',
    example: 'Suíte Diamantes',
    required: true,
  })
  @IsString()
  nomeApartamento: string;

  @ApiProperty({
    type: Date,
    description: 'Data hora do check-in (no mínimo 24 horas no futuro)',
    example: '2022-08-01T12:00:00.590Z',
    required: true,
  })
  @IsDateString()
  checkIn: string | Date;

  @ApiProperty({
    type: Date,
    description: 'Data hora do check-out.',
    example: '2022-08-03T12:00:00.590Z',
    required: true,
  })
  @IsDateString()
  checkOut: string | Date;

  @ApiProperty({
    type: Number,
    description: 'Quantidade de hospedes na reserva.',
    example: 2,
    required: true,
  })
  @IsInt()
  qtdHospedes: number;

  @ApiProperty({
    type: String,
    description: 'ID do usuário que está criando a reserva.',
    required: true,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    type: Object,
    description: 'Dados dos hospedes.',
    example: `[{nome: 'Marcos da silva', email: 'marcos@email.com'},{nome: 'Noemi da Silva', email: 'noemi@email.com'}]`,
    required: true,
  })
  @IsArray()
  hospedes?: Reserva['hospedes'];
}
