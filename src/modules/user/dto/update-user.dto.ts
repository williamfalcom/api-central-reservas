import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ readOnly: true })
  @IsInt()
  @IsOptional()
  id?: string;

  @ApiProperty({
    type: Date,
    description: 'Data hora de criação de registro.',
    required: false,
    readOnly: true,
  })
  @IsDateString()
  @IsOptional()
  createdAt?: string | Date;

  @ApiProperty({
    type: Date,
    description: 'Data hora de atualização de registro.',
    required: false,
    readOnly: true,
  })
  @IsDateString()
  @IsOptional()
  updatedAt?: string | Date;

  @ApiProperty({
    type: String,
    description: 'Nome do usuário',
    example: 'Marcos da Silva',
    required: false,
  })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({
    type: String,
    description: 'Email do usuário.',
    example: 'email@mail.com.br',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: String,
    description:
      'Senha do usuário (deve conter maiuscula, minusculas e números com minimo 8 e máximo 20 caracteres)',
    example: 'GTr2hfg3',
    required: false,
    writeOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Senha muito fraca, precisa conter maiusculas, minusculas e números.',
  })
  @IsOptional()
  senha?: string;
}
