/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ForbiddenException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NoContentInterceptor } from './common/interceptors/not-content.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { CustomLogger } from './custom.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
  if (allowedOrigins) {
    const whitelist = allowedOrigins.split(',').map((item) => item.trim());
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new ForbiddenException('origin not allowed by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
  } else {
    console.warn(
      'CORS_ALLOWED_ORIGINS não está definido. CORS não está habilitado.',
    );
  }

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new NoContentInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useLogger(app.get(CustomLogger));

  const config = new DocumentBuilder()
    .setTitle('Shortener Url API')
    .setDescription('Shortener Url API')
    .setVersion('0.3.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
