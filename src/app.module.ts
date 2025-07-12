import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UrlsModule } from './urls/urls.module';

@Module({
  imports: [UsersModule, UrlsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
