export interface UserPayload {
  sub: string;
  email: string;
  nome: string;
  iat?: number;
  exp?: number;
}
