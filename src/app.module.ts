import { Module } from '@nestjs/common';
import { UrlsModule } from './modules/urls/urls.module';
import { AuthModule } from './modules/auth/auth.module';

import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom.logger';
import { UsersModule } from './modules/users/users.module';

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
