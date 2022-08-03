import { Hospede } from '../../modules/reserva/entities/hospede.entity';
import { Reserva } from '../../modules/reserva/entities/reserva.entity';
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

  static givMeAValidReserva(): Reserva {
    const reserva = new Reserva();
    reserva.id = '62e863e6f1d9263fc29ddda3';
    reserva.nomeApartamento = 'Suíte Diamantes';
    reserva.checkIn = '2022-08-08T12:00:00.590Z';
    reserva.checkOut = '2022-08-10T12:30:00.590Z';
    reserva.qtdHospedes = 1;
    reserva.userId = '62e5efd9a840f407ac961a97';
    reserva.hospedes = [
      {
        nome: 'Marcos da Silva',
        email: 'marcos@email.com',
      },
    ];
    return reserva;
  }
}
