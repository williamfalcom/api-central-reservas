import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  @ApiProperty({ readOnly: true })
  @IsString()
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
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    type: String,
    description: 'Email do usuário.',
    example: 'email@mail.com.br',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description:
      'Senha do usuário (deve conter maiuscula, minusculas e números com minimo 8 e máximo 20 caracteres)',
    example: 'GTr2hfg3',
    required: true,
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
  senha: string;
}
