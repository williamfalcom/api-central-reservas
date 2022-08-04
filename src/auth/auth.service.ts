import { Injectable } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string) {
    const user = await this.userService.findByEmail(email).catch(() => {
      throw new Error('Usuário ou senha inválido.');
    });

    if (user) {
      //Checar senha
      const isSenhaValid = await bcrypt.compare(senha, user.senha);
      if (isSenhaValid) {
        return {
          ...user,
          senha: undefined,
        };
      }
    }
    throw new Error('Usuário ou senha inválido.');
  }

  login(user: User): UserToken {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
  }
}
