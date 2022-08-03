import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configDoc = new DocumentBuilder()
    .setTitle('Documentação API Central de Reservas')
    .setDescription('API Central de Reservas.')
    .setContact(
      'William Guimarães',
      'https://wgdev.com.br',
      'william@wgdev.com.br',
    )
    .setVersion('0.1')
    .addBearerAuth()
    .addTag('user', 'Rotas de Usuário')
    .addTag('reserva', 'Rotas de Reserva')
    .addServer('http://localhost:3000', 'Desenvolvimento Local')
    .build();

  const customOption: SwaggerCustomOptions = {
    customSiteTitle: 'Documentação API Central de Reservas.',
    customCss: `
      .topbar img{
        content: url("https://upload.wikimedia.org/wikipedia/commons/e/e7/HOTEL.png")
      }
      `,
  };

  const documentacao = SwaggerModule.createDocument(app, configDoc);
  SwaggerModule.setup('doc', app, documentacao, customOption);

  await app.listen(3000);
}
bootstrap();
