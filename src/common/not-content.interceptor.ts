/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class NoContentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data) && data.length === 0) {
          throw new HttpException('', HttpStatus.NO_CONTENT);
        }
        return data;
      }),
    );
  }
}
