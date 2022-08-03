import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<CreateUserDto> {
    const user = {
      ...data,
      senha: await bcrypt.hash(data.senha, 10),
    };
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (userExists && userExists.email === data.email) {
      throw new Error('User email already exists.');
    }

    const criatedUser = await this.prisma.user.create({
      data: user,
    });

    return {
      ...criatedUser,
      senha: undefined,
    };
  }

  async findAll(): Promise<UpdateUserDto[]> {
    const users = await this.prisma.user
      .findMany({
        select: {
          id: true,
          nome: true,
          email: true,
        },
      })
      .catch(() => {
        throw new Error('Error listing users.');
      });

    return users;
  }

  async findOne(id: string): Promise<CreateUserDto> {
    const user = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new Error('User not existes!');
      });

    return {
      ...user,
      senha: undefined,
    };
  }

  async update(id: string, data: UpdateUserDto): Promise<UpdateUserDto> {
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    await this.prisma.user
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new Error('User not existes!');
      });

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return {
      ...updatedUser,
      senha: undefined,
    };
  }

  async remove(id: string) {
    await this.prisma.user
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => {
        throw new Error('User not existes!');
      });

    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<UpdateUserDto> {
    return await this.prisma.user
      .findUniqueOrThrow({
        where: { email },
      })
      .catch(() => {
        throw new Error('User not existes wiht this email!');
      });
  }
}
