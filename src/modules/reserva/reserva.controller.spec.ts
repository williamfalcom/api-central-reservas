import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { reduce } from 'rxjs';
import { TestUtil } from '../../commom/test/testUtils';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva.service';

describe('ReservaController', () => {
  let testeReservaController: ReservaController;
  let testeReservaService: ReservaService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findManyCheckInCheckOut: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservaController],
      providers: [
        {
          provide: ReservaService,
          useValue: mockService,
        },
      ],
    }).compile();

    testeReservaController = module.get<ReservaController>(ReservaController);
    testeReservaService = module.get<ReservaService>(ReservaService);
  });

  beforeEach(() => {
    mockService.create.mockReset();
    mockService.findAll.mockReset();
    mockService.findOne.mockReset();
    mockService.update.mockReset();
    mockService.remove.mockReset();
  });

  it('deve estar definido', () => {
    expect(testeReservaController).toBeDefined();
  });

  describe('create', () => {
    it('deve criar a reserva com sucesso.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockService.create.mockResolvedValueOnce(reserva);
      const newReserva = await testeReservaService.create(reserva);
      expect(newReserva).toMatchObject({
        nomeApartamento: 'Suíte Diamantes',
      });
      expect(mockService.create).toBeCalledTimes(1);
    });

    it('deve receber uma excessão de erro ao criar reserva.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockService.create.mockRejectedValueOnce(new Error());
      await testeReservaController.create(reserva).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
      });
      expect(mockService.create).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve listar todas as reservas cadastradas.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockService.findAll.mockResolvedValueOnce([reserva, reserva]);
      const listReserva = await testeReservaController.findAll();
      expect(listReserva).toHaveLength(2);
      expect(mockService.findAll).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve listar dados da reserva informada.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockService.findOne.mockResolvedValueOnce(reserva);
      const findReserva = await testeReservaController.findOne(
        '62e863e6f1d9263fc29ddda3',
      );
      expect(findReserva).toMatchObject({
        nomeApartamento: 'Suíte Diamantes',
      });
      expect(mockService.findOne).toBeCalledTimes(1);
    });

    it('deve retornar uma excessão de reserva inexistente.', async () => {
      mockService.findOne.mockRejectedValueOnce(new Error());
      await testeReservaController
        .findOne('62e863e6f1d9263fc29ddab2')
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
        });
      expect(mockService.findOne).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('deve atualizar a reserva com sucesso.', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockService.update.mockResolvedValueOnce(reserva);
      const reservaUp = await testeReservaController.update(
        '62e863e6f1d9263fc29ddda3',
        reserva,
      );
      expect(reservaUp).toMatchObject({
        nomeApartamento: 'Suíte Diamantes',
      });
      expect(mockService.update).toBeCalledTimes(1);
    });

    it('deve retornar uma excessão de falha de update', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockService.update.mockRejectedValueOnce(new Error());
      await testeReservaController
        .update('62e863e6f1d9263fc29ddab4', reserva)
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
        });
      expect(mockService.update).toBeCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve remover a reserva com sucesso', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockService.remove.mockResolvedValueOnce(reserva);
      const reservaRm = await testeReservaController.remove(
        '62e863e6f1d9263fc29ddda3',
      );
      expect(reservaRm).toMatchObject(reserva);
      expect(mockService.remove).toBeCalledTimes(1);
    });

    it('deve retornar uma excessão de reserva não encontrada', async () => {
      mockService.remove.mockRejectedValueOnce(new Error());
      await testeReservaController
        .remove('62e863e6f1d9263fc29ddda3')
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
        });
      expect(mockService.remove).toBeCalledTimes(1);
    });
  });

  describe('findManyCheckInCheckOut', () => {
    it('deve listar reservas por checkIn e checkOut', async () => {
      const reserva = TestUtil.givMeAValidReserva();
      mockService.findManyCheckInCheckOut.mockResolvedValueOnce([
        reserva,
        reserva,
      ]);
      const reservaListaChecks =
        await testeReservaController.findManyCheckInCheckOut(
          '2022-08-01T12:00:00Z',
          '2022-08-10T12:00:00Z',
        );
      expect(reservaListaChecks).toHaveLength(2);
      expect(mockService.findManyCheckInCheckOut).toBeCalledTimes(1);
    });
  });
});
