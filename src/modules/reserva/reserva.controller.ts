import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  NotFoundException,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { CheckReservaPipe } from './pipes/check-reserva.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Reserva } from './entities/reserva.entity';
import { CheckReservaUpdatePipe } from './pipes/check-reserva-update.pipe';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiBearerAuth()
@ApiTags('reserva')
@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @UsePipes(CheckReservaPipe)
  @ApiOperation({
    description: 'Recurso para criar nova reserva.',
    summary: 'Criar nova Reserva.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro de validação.',
    schema: {
      type: 'object',
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'A data de check-id deve estar no mínimo 24 horas no futuro.',
          'A data para a reserva encontra-se ocupada.',
        ],
        error: 'Bad Request',
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createReservaDto: CreateReservaDto,
    @CurrentUser() user: User,
  ): Promise<Reserva> {
    const data = {
      ...createReservaDto,
      userId: user.id,
    };
    return await this.reservaService.create(data).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  @Get()
  @ApiOperation({
    description: 'Recurso para a listagem das reservas.',
    summary: 'Listar Reservas',
  })
  async findAll(): Promise<Reserva[]> {
    return await this.reservaService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    description: 'Recurso para busca de reservar por ID.',
    summary: 'Busca Reserva por ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reserva não encontrada',
    schema: {
      type: 'object',
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No Reserva found',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return await this.reservaService.findOne(id).catch((e) => {
      throw new NotFoundException(e.message);
    });
  }

  @Patch(':id')
  @UsePipes(CheckReservaUpdatePipe)
  @ApiOperation({
    description: 'Recurso para atualização de reserva',
    summary: 'Atualizar reserva',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro de validação.',
    schema: {
      type: 'object',
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['O email do hospede (Marcos da silva) não é válido'],
        error: 'Bad Request',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    return await this.reservaService.update(id, updateReservaDto).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Recurso para remoção de reserva',
    summary: 'Excluir reserva',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reserva não encontrada',
    schema: {
      type: 'object',
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Reserva Not Found',
        error: 'Not Found',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.reservaService.remove(id).catch((e) => {
      throw new NotFoundException(e.message);
    });
  }

  @Get(':checkIn/:checkOut')
  @ApiOperation({
    description: 'Recurso para busca de reserva por check-in e check-out',
    summary: 'Busca Reserva por check-in e check-out',
  })
  @ApiParam({
    name: 'checkIn',
    description: 'Data hora em formato ISO.',
    example: '2022-08-01T12:00:00Z',
  })
  @ApiParam({
    name: 'checkOut',
    description: 'Data hora em formato ISO.',
    example: '2022-08-10T12:00:00Z',
  })
  async findManyCheckInCheckOut(
    @Param('checkIn') checkIn: string,
    @Param('checkOut') checkOut: string,
  ) {
    return await this.reservaService.findManyCheckInCheckOut(checkIn, checkOut);
  }
}
