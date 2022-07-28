import { User } from '../../modules/user/entities/user.entity';

export class TestUtil {
  static givMeAValidUser(): User {
    const user = new User();
    user.id = '62e22d891c3d34192ef20dda';
    user.nome = 'Usuário válido';
    user.email = 'valido@email.com';
    user.senha = 'Teste@1234';
    return user;
  }
}
