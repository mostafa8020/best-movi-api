import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { ResponseInterceptor } from '../shared/interceptors/response.interceptor';
import { TypeORMExceptionFilter } from 'src/shared/filters/database-exception.filter';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { UserModule } from 'src/users/users.module';
import { TransformInterceptor } from 'src/users/interceptors/transformer.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),

    CacheModule.register({
      host: 'redis',
      port: 6379,
      ttl: 3600,
      isGlobal: true,
    }),

    UserModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      useValue: {
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      },
    },
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class GlobalModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }

  static configureSwagger(app: any) {
    const config = new DocumentBuilder()
      .setTitle('Food Manager API')
      .addBearerAuth()
      .setVersion('1.0')
      .addServer('http://localhost:3000/', 'Local environment')
      // .addServer('https://dev.foodmanager.co/', 'Development')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        plugins: [
          (...args: any[]) => (window as any).HierarchicalTagsPlugin(...args),
          (...args: any[]) =>
            (window as any).SwaggerUIBundle.plugins.DownloadUrl(...args),
        ],
        hierarchicalTagSeparator: ':',
      },
      customJs: ['https://unpkg.com/swagger-ui-plugin-hierarchical-tags'],
    });
  }
}
