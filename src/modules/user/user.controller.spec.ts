import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestUtil } from '../../commom/test/testUtils';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let testUserController: UserController;
  let testUserService: UserService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    testUserController = module.get<UserController>(UserController);
    testUserService = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockService.create.mockReset();
    mockService.findAll.mockReset();
    mockService.findOne.mockReset();
    mockService.update.mockReset();
    mockService.remove.mockReset();
    mockService.findByEmail.mockReset();
  });

  it('deve estar definido', () => {
    expect(testUserController).toBeDefined();
    expect(testUserService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo unuário', async () => {
      const user = TestUtil.givMeAValidUser();
      mockService.create.mockResolvedValueOnce(user);
      const usuarioCriado = await testUserController.create(user);

      expect(usuarioCriado).toMatchObject(user);
      expect(mockService.create).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão de falha ao cirar novo usuário.', async () => {
      const user = TestUtil.givMeAValidUser();
      mockService.create.mockRejectedValueOnce(new Error());

      await testUserController.create(user).catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException);
      });
      expect(mockService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve listar todos os usuários', async () => {
      const user = TestUtil.givMeAValidUser();
      mockService.findAll.mockResolvedValueOnce([user, user]);
      const users = await testUserController.findAll();

      expect(users).toHaveLength(2);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão ao tentar listar usuários', async () => {
      mockService.findAll.mockRejectedValueOnce(new Error());
      await testUserController.findAll().catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException);
      });
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve buscar um usuário existente', async () => {
      const user = TestUtil.givMeAValidUser();
      mockService.findOne.mockResolvedValueOnce(user);
      const usuarioEncontrado = await testUserController.findOne(
        '62e22d891c3d34192ef20dda',
      );

      expect(usuarioEncontrado).toMatchObject(user);
      expect(mockService.findOne).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão de usuário não encontrado.', async () => {
      mockService.findOne.mockRejectedValueOnce(new Error());

      await testUserController
        .findOne('62e22d891c3d34192ef20eeb')
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
        });
      expect(mockService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('deve atualizar usuário existente.', async () => {
      const user = TestUtil.givMeAValidUser();
      const dataUpdate = { nome: 'Nome Atualizado.' };
      mockService.update.mockResolvedValueOnce({
        ...user,
        ...dataUpdate,
      });
      const usuarioAtualizado = await testUserController.update(
        '62e22d891c3d34192ef20dda',
        {
          ...user,
          nome: 'Nome Atualizado.',
        },
      );
      expect(usuarioAtualizado).toMatchObject(dataUpdate);
      expect(mockService.update).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão ao tentar atualizar usuário.', async () => {
      const user = TestUtil.givMeAValidUser();
      mockService.update.mockRejectedValueOnce(new Error());
      await testUserController
        .update('62e22d891c3d34192ef20eeb', {
          ...user,
          nome: 'Nome Atualizado.',
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
        });
      expect(mockService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve remover usuário existente.', async () => {
      const user = TestUtil.givMeAValidUser();
      mockService.remove.mockResolvedValueOnce(user);
      await testUserController.remove('62e22d891c3d34192ef20dda');
      expect(mockService.remove).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão ao tentar remover usuário.', async () => {
      mockService.remove.mockRejectedValueOnce(new Error());
      await testUserController.remove('62e22d891c3d34192ef20eeb').catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException);
      });
      expect(mockService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
