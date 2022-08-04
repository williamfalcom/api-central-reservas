import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../modules/user/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { IsPublic } from './decorators/is-public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { UserToken } from './models/UserToken';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @ApiOperation({
    description: 'Recurso para login e geração de token JWT.',
    summary: 'Login de usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticação de usuário',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoid2lsbGlhbUB3Z2Rldi5jb20uYnIiLXPTO21lIjoiV2lsbGlhbSBFRCAtLS0iXPTpYXQiOjE2NTc3MzkyODMsImV4cCI6MTY1ODYwMzI4M30.QC3r65C9Kp-nAB_qHdshQK3AIlgSoGhHm5E6QLzFwyc',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Usuário ou senha inválido.',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBody({
    schema: {
      example: {
        email: 'teste@mail.com.br',
        senha: 'Teste123',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest): UserToken {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({
    description: 'Recurso para verificação do usuário logado no token JWT.',
    summary: 'Retorna dados do usuário logado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário logado.',
    schema: {
      example: {
        id: 1,
        email: 'nome@mail.com.br',
        nome: 'Marcos da Silva',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
