import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as moment from 'moment';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { ReservaService } from '../reserva.service';

@Injectable()
export class CheckReservaPipe implements PipeTransform<CreateReservaDto> {
  constructor(private readonly reservaService: ReservaService) {}

  isEmail(email) {
    var emailRegex =
      /^[a-zA-Z0-9.!#$%&‘*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(emailRegex)) {
      return true;
    }
    return false;
  }

  async transform(value: CreateReservaDto, metadata: ArgumentMetadata) {
    const dateNow = moment();
    const dateCheckIn = moment(value.checkIn);
    const dataCheckOut = moment(value.checkOut);
    var checkErros = [];

    if (dateCheckIn.diff(dateNow, 'd') < 1) {
      checkErros.push(
        'A data de check-id deve estar no mínimo 24 horas no futuro.',
      );
    }
    if (dataCheckOut.diff(dateCheckIn, 'd') < 1) {
      checkErros.push(
        'A data de check-out deve ser no minimo 24 horas após o check-in.',
      );
    }

    const dateIsVacant = await this.reservaService.dateIsVacant(
      value.checkIn,
      value.checkOut,
    );
    if (dateIsVacant.length > 0) {
      checkErros.push('A data para a reserva encontra-se ocupada.');
    }

    if (value.hospedes.length > 0) {
      value.hospedes.forEach((hospede) => {
        if (!this.isEmail(hospede.email)) {
          checkErros.push(`O email do hospede (${hospede.nome}) não é válido`);
        }
      });
    } else {
      checkErros.push('hospedes precisa ser informado.');
    }

    if (checkErros.length > 0) {
      throw new BadRequestException(checkErros);
    }

    return value;
  }
}
