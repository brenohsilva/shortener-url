import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error ? exception.message : 'Internal server error';

    const stack = exception instanceof Error ? exception.stack : undefined;

    const errorResponse = {
      statusCode: status,
      message: message,
    };

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Message: ${message}`,
      stack,
      'ExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
