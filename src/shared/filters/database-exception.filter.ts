import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (process.env.NODE_ENV === 'development') {
      console.error(exception);
    }

    let message = 'Internal Server Error';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.message.includes('duplicate key')) {
      statusCode = HttpStatus.CONFLICT;
      message = `Duplicate entry: ${exception.message}`;
    } else if (exception.message.includes('foreign key constraint')) {
      statusCode = HttpStatus.FORBIDDEN;
      message = `Foreign key constraint failed: ${exception.message}`;
    } else if (exception.message.includes('not found')) {
      statusCode = HttpStatus.NOT_FOUND;
      message = `Record not found: ${exception.message}`;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: 'DatabaseError',
    });
  }
}
