import { Test, TestingModule } from '@nestjs/testing';
import { TestUtil } from '../../commom/test/testUtils';
import { PrismaService } from '../../database/PrismaService';
import { ReservaService } from './reserva.service';

describe('ReservaService', () => {
  let testReservaService: ReservaService;
  let testPrismaService: PrismaService;

  const mockPrisma = {
    reserva: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    hospede: {
      deleteMany: jest.fn(),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservaService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    testReservaService = module.get<ReservaService>(ReservaService);
    testPrismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    mockPrisma.reserva.create.mockReset();
    mockPrisma.reserva.findMany.mockReset();
    mockPrisma.reserva.findUniqueOrThrow.mockReset();
    mockPrisma.reserva.update.mockReset();
    mockPrisma.reserva.delete.mockReset();
    mockPrisma.hospede.deleteMany.mockReset();
  });

  it('deve estar definido', () => {
    expect(testReservaService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova reserva', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.create.mockResolvedValueOnce(reserva);
      const newUser = await testReservaService.create(reserva);

      expect(newUser).toMatchObject({
        nomeApartamento: 'Suíte Diamantes',
      });
      expect(mockPrisma.reserva.create).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão ao criar reserva', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.create.mockRejectedValueOnce(new Error());
      await testReservaService.create(reserva).catch((e) => {
        expect(e).toBeInstanceOf(Error);
      });
      expect(mockPrisma.reserva.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve listar todas as reservas.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.findMany.mockResolvedValueOnce([
        reserva,
        reserva,
        reserva,
      ]);
      const listReserva = await testReservaService.findAll();

      expect(listReserva).toHaveLength(3);
      expect(mockPrisma.reserva.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findeOn', () => {
    it('deve retornar dados da busca da reserva.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.findUniqueOrThrow.mockResolvedValueOnce(reserva);
      const reservaFindOne = await testReservaService.findOne(
        '62e22d891c3d34192ef20dda',
      );

      expect(reservaFindOne).toMatchObject({
        nomeApartamento: 'Suíte Diamantes',
      });
      expect(mockPrisma.reserva.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão de falha ao buscar reserva.', async () => {
      mockPrisma.reserva.findUniqueOrThrow.mockRejectedValueOnce(new Error());

      await testReservaService
        .findOne('62e22d891c3d34192ef27193')
        .catch((e) => {
          expect(e).toBeInstanceOf(Error);
        });
      expect(mockPrisma.reserva.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('deve fazer o update da reserva.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.findUniqueOrThrow.mockResolvedValueOnce(reserva);
      mockPrisma.reserva.findMany.mockResolvedValueOnce([]);
      mockPrisma.reserva.update.mockResolvedValueOnce(reserva);
      const reservaUp = await testReservaService.update(
        '62e22d891c3d34192ef20dda',
        reserva,
      );
      expect(reservaUp).toMatchObject({
        nomeApartamento: 'Suíte Diamantes',
      });
      expect(mockPrisma.reserva.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.reserva.findMany).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão de reserva não encontrada', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.findUniqueOrThrow.mockRejectedValueOnce(new Error());
      await testReservaService
        .update('62e22d891c3d34192ef20dab', reserva)
        .catch((e) => {
          expect(e).toBeInstanceOf(Error);
          expect(e).toMatchObject({
            message: 'Reserva Not Found',
          });
        });
      expect(mockPrisma.reserva.findUniqueOrThrow).toBeCalledTimes(1);
    });

    it('deve retornar uma excessão de reserva ocupada.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.findUniqueOrThrow.mockResolvedValueOnce(reserva);
      mockPrisma.reserva.findMany.mockResolvedValueOnce([reserva]);
      await testReservaService
        .update('62e22d891c3d34192ef20dda', reserva)
        .catch((e) => {
          expect(e).toBeInstanceOf(Error);
          expect(e).toMatchObject({
            message: 'A data para a reserva encontra-se ocupada.',
          });
        });
      expect(mockPrisma.reserva.findUniqueOrThrow).toBeCalledTimes(1);
      expect(mockPrisma.reserva.findMany).toBeCalledTimes(1);
    });

    it('deve retornar uma excessão de falha ao tentar atualizar reserva.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.findUniqueOrThrow.mockResolvedValueOnce(reserva);
      mockPrisma.reserva.findMany.mockResolvedValueOnce([]);
      mockPrisma.reserva.update.mockRejectedValueOnce(new Error());
      await testReservaService
        .update('62e22d891c3d34192ef20dda', reserva)
        .catch((e) => {
          expect(e).toBeInstanceOf(Error);
        });
      expect(mockPrisma.reserva.findUniqueOrThrow).toBeCalledTimes(1);
      expect(mockPrisma.reserva.findMany).toBeCalledTimes(1);
      expect(mockPrisma.reserva.update).toBeCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve remover a reserva com sucesso', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      const hospede = {
        nome: 'Marcos da Silva',
        email: 'marcos@email.com',
      };
      mockPrisma.reserva.findUniqueOrThrow.mockResolvedValueOnce(reserva);
      mockPrisma.hospede.deleteMany.mockResolvedValueOnce(hospede);
      mockPrisma.reserva.delete.mockResolvedValueOnce(reserva);
      const reservaRm = await testReservaService.remove(
        '62e22d891c3d34192ef20dda',
      );
      expect(reservaRm).toMatchObject({
        nomeApartamento: 'Suíte Diamantes',
      });
      expect(mockPrisma.reserva.findUniqueOrThrow).toBeCalledTimes(1);
      expect(mockPrisma.hospede.deleteMany).toBeCalledTimes(1);
      expect(mockPrisma.reserva.delete).toBeCalledTimes(1);
    });

    it('deve retornar excessão de reserva não encontrada', async () => {
      mockPrisma.reserva.findUniqueOrThrow.mockRejectedValueOnce(new Error());
      await testReservaService.remove('62e22d891c3d34192ef20dab').catch((e) => {
        expect(e).toBeInstanceOf(Error);
        expect(e).toMatchObject({
          message: 'Reserva Not Found',
        });
      });
      expect(mockPrisma.reserva.findUniqueOrThrow).toBeCalledTimes(1);
    });

    it('deve retornar excessão de hospede não encontrada', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.findUniqueOrThrow.mockResolvedValueOnce(reserva);
      mockPrisma.hospede.deleteMany.mockRejectedValueOnce(new Error());
      await testReservaService.remove('62e22d891c3d34192ef20dab').catch((e) => {
        expect(e).toBeInstanceOf(Error);
        expect(e).toMatchObject({
          message: 'Hospede Not Found',
        });
      });
      expect(mockPrisma.reserva.findUniqueOrThrow).toBeCalledTimes(1);
      expect(mockPrisma.hospede.deleteMany).toBeCalledTimes(1);
    });

    it('deve retornar excessão de falha ao tentar remover reserva', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      const hospede = {
        nome: 'Marcos da Silva',
        email: 'marcos@email.com',
      };
      mockPrisma.reserva.findUniqueOrThrow.mockResolvedValueOnce(reserva);
      mockPrisma.hospede.deleteMany.mockResolvedValueOnce(hospede);
      mockPrisma.reserva.delete.mockRejectedValueOnce(new Error());
      await testReservaService.remove('62e22d891c3d34192ef20dab').catch((e) => {
        expect(e).toBeInstanceOf(Error);
      });
      expect(mockPrisma.reserva.findUniqueOrThrow).toBeCalledTimes(1);
      expect(mockPrisma.hospede.deleteMany).toBeCalledTimes(1);
      expect(mockPrisma.reserva.delete).toBeCalledTimes(1);
    });
  });

  describe('dateIsVacant', () => {
    it('deve verificar se há vaga para a reserva entre check-in e check-out', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.findMany.mockResolvedValueOnce([reserva, reserva]);
      const dateVacate = await testReservaService.dateIsVacant(
        '2022-08-01T12:00:00Z',
        '2022-08-10T12:00:00Z',
      );
      expect(dateVacate).toHaveLength(2);
      expect(mockPrisma.reserva.findMany).toBeCalledTimes(1);
    });
  });

  describe('findManyCheckInCheckOut', () => {
    it('deve buscar reservas por check-in e check-out', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockPrisma.reserva.findMany.mockResolvedValueOnce([
        reserva,
        reserva,
        reserva,
      ]);
      const dateVacate = await testReservaService.findManyCheckInCheckOut(
        '2022-08-01T12:00:00Z',
        '2022-08-10T12:00:00Z',
      );
      expect(dateVacate).toHaveLength(3);
      expect(mockPrisma.reserva.findMany).toBeCalledTimes(1);
    });
  });
});
