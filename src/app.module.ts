import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UrlsModule } from './urls/urls.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, UrlsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
