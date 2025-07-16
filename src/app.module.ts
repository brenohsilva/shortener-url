import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UrlsModule } from './urls/urls.module';
import { AuthModule } from './auth/auth.module';

import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom.logger';

@Module({
  imports: [
    UsersModule,
    UrlsModule,
    AuthModule,
    LoggerModule.forRoot({ pinoHttp: { level: 'trace' } }),
  ],
  controllers: [],
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class AppModule {}
