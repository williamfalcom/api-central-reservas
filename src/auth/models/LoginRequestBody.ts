import { IsEmail, IsString } from 'class-validator';

export class LoginRequestBody {
  /**
   * Email de login do usuário
   * @example teste@mail.com.br
   */
  @IsEmail()
  email: string;

  /**
   * Senha de acesso do usuário
   * @example Teste123
   */
  @IsString()
  senha: string;
}