import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { CreateReservaDto } from './create-reserva.dto';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
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
    required: false,
  })
  @IsString()
  nomeApartamento?: string;

  @ApiProperty({
    type: Date,
    description: 'Data hora do check-in.',
    example: '2022-08-01T12:00:00.590Z',
    required: false,
    readOnly: false,
  })
  @IsDateString()
  checkIn?: string | Date;

  @ApiProperty({
    type: Date,
    description: 'Data hora do check-out.',
    example: '2022-08-03T12:00:00.590Z',
    required: false,
    readOnly: false,
  })
  @IsDateString()
  checkOut?: string | Date;

  @ApiProperty({
    type: Number,
    description: 'Quantidade de hospedes na reserva.',
    example: 2,
    required: false,
  })
  @IsInt()
  qtdHospedes?: number;
}
