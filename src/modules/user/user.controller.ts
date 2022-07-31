import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

//@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    description: 'Recurso para cadastrar novo usuário.',
    summary: 'Criar novo usuário.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação.',
    schema: {
      type: 'object',
      example: {
        statusCode: 400,
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
    status: 400,
    description: 'Erro ao listar usuários.',
    schema: {
      type: 'object',
      example: {
        statusCode: 400,
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
    status: 404,
    description: 'Usuário não encontrados',
    schema: {
      type: 'object',
      example: {
        statusCode: 404,
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
    status: 404,
    description: 'Usuário não encontrado para atualização',
    schema: {
      type: 'object',
      example: {
        statusCode: 404,
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
    status: 404,
    description: 'Usuário não encontrado.',
    schema: {
      type: 'object',
      example: {
        statusCode: 404,
        message: 'User not existes!',
        error: 'Not Found',
      },
    },
  })
  async remove(@Param('id') id: string) {
    await this.userService.remove(id).catch((error) => {
      throw new NotFoundException(error.message);
    });
  }
}
