import * as bcrypt from 'bcrypt';

export function generateHash(password: string): string {
  const hashedPassword: string = bcrypt.hashSync(password, 10);
  return hashedPassword;
}
