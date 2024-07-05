import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    this.logger.debug(`httpAdapter: ${httpAdapter}`);
    this.logger.debug(`ctx.getResponse(): ${ctx.getResponse()}`);

    if (!httpAdapter) {
      this.logger.error('httpAdapter is undefined');
      return;
    }

    if (!ctx.getResponse()) {
      this.logger.error('ctx.getResponse() is undefined');
      return;
    }

    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.error(`Exception: ${exception}, stack: ${exception}`);

    const responseBody = {
      status: httpStatus,
      message: 'Internal Server error',
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
