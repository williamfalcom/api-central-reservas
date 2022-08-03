import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ReservaModule } from './modules/reserva/reserva.module';

@Module({
  imports: [UserModule, ReservaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
