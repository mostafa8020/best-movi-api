import { Module } from '@nestjs/common';
import { AllExceptionsFilter, HttpExceptionFilter } from './filters';

@Module({
  imports: [],
  providers: [AllExceptionsFilter, HttpExceptionFilter],
  exports: [AllExceptionsFilter, HttpExceptionFilter],
})
export class SharedModule {}
