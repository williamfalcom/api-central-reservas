import { Hospede } from './hospede.entity';

export class Reserva {
  id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  nomeApartamento: string;
  checkIn: string | Date;
  checkOut: string | Date;
  qtdHospedes: number;
  hospedes?: Hospede[];
  userId: string;
}
