import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    let logMessage =
      exception && exception.message
        ? exception.message
        : 'Undefined exception message';

    if (status === 400 && exception instanceof HttpException) {
      const validationErrors = exception.getResponse() as ValidationError[];
      if (validationErrors) {
        logMessage = JSON.stringify((validationErrors as any).message);
      }
    }

    this.logger.error(`Exception: ${logMessage}, status: ${status}`);

    if (status === 400) {
      if (exception instanceof HttpException) {
        const validationErrors = exception.getResponse() as ValidationError[];

        if (validationErrors) {
          const formattedErrors = (validationErrors as any).message;

          response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            error: 'Bad Request',
            message: formattedErrors,
          });
          return;
        }
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        error: 'Bad Request',
        message: exception.message,
      });
    } else {
      response.status(status).json(
        isProduction
          ? {
              statusCode: status,
              timestamp: new Date().toISOString(),
              message: exception.message,
            }
          : {
              statusCode: status,
              timestamp: new Date().toISOString(),
              message: exception.message,
              stacktrace: exception.stack,
            },
      );
    }
  }
}
