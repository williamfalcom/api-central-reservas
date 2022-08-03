import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';

@Injectable()
export class ReservaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    const reserva = await this.prisma.reserva
      .create({
        data: {
          ...createReservaDto,
          hospedes: {
            createMany: {
              data: createReservaDto.hospedes,
            },
          },
        },
        include: {
          hospedes: true,
        },
      })
      .catch((err) => {
        throw new Error(`Create reserva error (${err.message})`);
      });

    return reserva;
  }

  async findAll(): Promise<Reserva[]> {
    return await this.prisma.reserva.findMany({
      include: { hospedes: true },
    });
  }

  async findOne(id: string): Promise<Reserva> {
    return await this.prisma.reserva
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          hospedes: true,
        },
      })
      .catch((e) => {
        throw new Error(e.message);
      });
  }

  async update(id: string, data: UpdateReservaDto) {
    await this.prisma.reserva
      .findUniqueOrThrow({
        where: { id },
      })
      .catch((e) => {
        throw new Error('Reserva Not Found');
      });

    const isDateVacant = await this.prisma.reserva.findMany({
      where: {
        id: {
          not: id,
        },
        OR: [
          {
            checkIn: {
              lte: data.checkOut,
            },
            checkOut: {
              gte: data.checkIn,
            },
          },
        ],
      },
    });
    if (isDateVacant.length > 0) {
      throw new Error('A data para a reserva encontra-se ocupada.');
    }
    const dataUp = {
      nomeApartamento: data.nomeApartamento,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      qtdHospedes: data.qtdHospedes,
    };
    const reservaUpdated = await this.prisma.reserva
      .update({
        where: {
          id,
        },
        data: dataUp,
      })
      .catch((e) => {
        throw new Error(`Erro ao tentar fazer o update: ( ${e.message} )`);
      });

    return reservaUpdated;
  }

  async remove(id: string) {
    await this.prisma.reserva
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => {
        throw new Error('Reserva Not Found');
      });
    await this.prisma.hospede
      .deleteMany({
        where: {
          reservaID: id,
        },
      })
      .catch((e) => {
        throw new Error('Hospede Not Found');
      });
    return this.prisma.reserva
      .delete({
        where: { id },
        include: { hospedes: true },
      })
      .catch((e) => {
        throw new Error(e.message);
      });
  }

  async dateIsVacant(
    checkIn: string | Date,
    checkOut: string | Date,
  ): Promise<Reserva[]> {
    return await this.prisma.reserva.findMany({
      where: {
        OR: [
          {
            checkIn: {
              lte: checkOut,
            },
            checkOut: {
              gte: checkIn,
            },
          },
        ],
      },
    });
  }

  async findManyCheckInCheckOut(
    checkIn: string | Date,
    checkOut: string | Date,
  ): Promise<Reserva[]> {
    return await this.prisma.reserva.findMany({
      where: {
        OR: [
          {
            checkIn: { gte: checkIn },
            checkOut: { lte: checkOut },
          },
        ],
      },
      include: {
        hospedes: true,
      },
    });
  }
}
