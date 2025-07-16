import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    this.logger.warn(`failed to authenticated with the email ${email}`);
    return null;
  }

  login(user: AuthenticatedUserDto) {
    const payload = { sub: user.id, email: user.email };
    const bearerToken = this.jwtService.sign(payload);
    this.logger.log(
      `User authenticated successfully with the email ${user.email}`,
    );
    return {
      token: bearerToken,
    };
  }
}
