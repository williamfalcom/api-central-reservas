import { Test, TestingModule } from '@nestjs/testing';
import { TestUtil } from '../../commom/test/testUtils';
import { PrismaService } from '../../database/PrismaService';
import { UserService } from './user.service';

describe('UserService', () => {
  let testUserService: UserService;
  let testPrisma: PrismaService;

  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    testUserService = module.get<UserService>(UserService);
    testPrisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    mockPrisma.user.findFirst.mockReset();
    mockPrisma.user.create.mockReset();
    mockPrisma.user.findMany.mockReset();
    mockPrisma.user.findUnique.mockReset();
    mockPrisma.user.update.mockReset();
    mockPrisma.user.delete.mockReset();
  });

  it('deve estar definido.', () => {
    expect(testUserService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      const user = TestUtil.givMeAValidUser();
      const newEmail = { email: 'valido2@email.com.br' };
      mockPrisma.user.findFirst.mockResolvedValueOnce(user);
      mockPrisma.user.create.mockResolvedValueOnce(user);
      const newUser = await testUserService.create({
        ...user,
        ...newEmail,
      });

      expect(newUser).toMatchObject({
        email: 'valido@email.com',
        senha: undefined,
      });
      expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão de falha ao criar usuário', async () => {
      const user = TestUtil.givMeAValidUser();
      mockPrisma.user.findFirst.mockResolvedValueOnce(user);

      await testUserService.create(user).catch((e) => {
        expect(e).toBeInstanceOf(Error);
      });
      expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve listar todos os usuários existentes.', async () => {
      const user = TestUtil.givMeAValidUser();
      mockPrisma.user.findMany.mockResolvedValueOnce([user, user, user]);
      const listUser = await testUserService.findAll();

      expect(listUser).toHaveLength(3);
      expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão ao listar usuários.', async () => {
      mockPrisma.user.findMany.mockRejectedValueOnce(new Error());
      await testUserService.findAll().catch((e) => {
        expect(e).toBeInstanceOf(Error);
      });
      expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findeOn', () => {
    it('deve retornar dados da busca do usuário.', async () => {
      const user = TestUtil.givMeAValidUser();
      mockPrisma.user.findUnique.mockResolvedValueOnce(user);
      const userFindOn = await testUserService.findOne(
        '62e22d891c3d34192ef20dda',
      );

      expect(userFindOn).toMatchObject({
        nome: 'Usuário válido',
        senha: undefined,
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão de falha ao buscar usuário.', async () => {
      mockPrisma.user.findUnique.mockRejectedValueOnce(new Error());

      await testUserService.findOne('62e22d891c3d34192ef27193').catch((e) => {
        expect(e).toBeInstanceOf(Error);
        expect(e).toMatchObject({
          message: 'User not existes!',
        });
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('deve fazer o update do usuário indicado.', async () => {
      const user = TestUtil.givMeAValidUser();
      mockPrisma.user.findUnique.mockResolvedValueOnce(user);
      mockPrisma.user.update.mockResolvedValueOnce(user);
      const userUp = await testUserService.update(
        '62e22d891c3d34192ef20dda',
        user,
      );
      expect(userUp).toMatchObject({
        nome: 'Usuário válido',
        senha: undefined,
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão ao tentar fazer update do usuário.', async () => {
      const user = TestUtil.givMeAValidUser();
      mockPrisma.user.findUnique.mockRejectedValueOnce(new Error());
      await testUserService
        .update('62e22d891c3d34192ef27193', user)
        .catch((e) => {
          expect(e).toBeInstanceOf(Error);
          expect(e).toMatchObject({
            message: 'User not existes!',
          });
        });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve remover o usuário com sucesso.', async () => {
      const user = TestUtil.givMeAValidUser();
      mockPrisma.user.findUnique.mockResolvedValueOnce(user);
      mockPrisma.user.delete.mockResolvedValueOnce(user);

      const userDeleted = await testUserService.remove(
        '62e22d891c3d34192ef20dda',
      );
      expect(userDeleted).toMatchObject(user);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.delete).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma excessão ao tentar remover usuário', async () => {
      mockPrisma.user.findUnique.mockRejectedValueOnce(new Error());
      await testUserService.remove('62e22d891c3d34192ef27193').catch((e) => {
        expect(e).toBeInstanceOf(Error);
        expect(e).toMatchObject({
          message: 'User not existes!',
        });
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEmail', () => {
    it('deve encontrar um usuário buscando pelo email.', async () => {
      const user = TestUtil.givMeAValidUser();
      mockPrisma.user.findUnique.mockResolvedValueOnce(user);
      const userByEmail = await testUserService.findByEmail(user.email);
      expect(userByEmail).toMatchObject(user);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('deve retornar excessão ao buscar usuário por email.', async () => {
      mockPrisma.user.findUnique.mockRejectedValueOnce(new Error());
      await testUserService.findByEmail('teste').catch((e) => {
        expect(e).toBeInstanceOf(Error);
        expect(e).toMatchObject({
          message: 'User not existes wiht this email!',
        });
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
