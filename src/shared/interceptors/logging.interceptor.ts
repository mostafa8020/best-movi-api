import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, Observable, tap } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;
    const controllerName = context.getClass().name;

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(`[${controllerName}] ${method} ${url} ${duration}ms`);
      }),
      catchError((err) => {
        const duration = Date.now() - start;
        this.logger.error(
          `[${controllerName}] ${method} ${url} ${duration}ms - ${response.statusCode} - ${response.statusMessage}`,
        );
        return throwError(() => err);
      }),
    );
  }
}
