import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsPublic } from '../../auth/decorators/is-public.decorator';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  @ApiOperation({
    description: 'Recurso para cadastrar novo usuário.',
    summary: 'Criar novo usuário.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro de validação.',
    schema: {
      type: 'object',
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['email must be an email'],
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto).catch((error) => {
      throw new NotFoundException(error.message);
    });
  }

  @Get()
  @ApiOperation({
    description: 'Recurso para listagem de usuário.',
    summary: 'Listagem de usuários.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao listar usuários.',
    schema: {
      type: 'object',
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Error listing users.'],
        error: 'Bad Request',
      },
    },
  })
  async findAll() {
    return await this.userService.findAll().catch((error) => {
      throw new NotFoundException(error.message);
    });
  }

  @Get(':id')
  @ApiOperation({
    description: 'Recurso para consulta de usuário específico.',
    summary: 'Dados do usuário.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrados',
    schema: {
      type: 'object',
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not existes!',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id).catch((error) => {
      throw new NotFoundException(error.message);
    });
  }

  @Patch(':id')
  @ApiOperation({
    description: 'Recurso para atualização de usuário.',
    summary: 'Atualização de usuário.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado para atualização',
    schema: {
      type: 'object',
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not existes!',
        error: 'Not Found',
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto).catch((error) => {
      throw new NotFoundException(error.message);
    });
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Recurso para excluir usuário.',
    summary: 'Exclusão de usuário.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado.',
    schema: {
      type: 'object',
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not existes!',
        error: 'Not Found',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.userService.remove(id).catch((error) => {
      throw new NotFoundException(error.message);
    });
  }
}
