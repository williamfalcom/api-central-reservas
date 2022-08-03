import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class CheckReservaUpdatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type != 'body') {
      return value;
    }

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

    if (checkErros.length > 0) {
      throw new BadRequestException(checkErros);
    }

    return value;
  }
}
