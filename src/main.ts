import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalModule } from './global/global.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  GlobalModule.configureSwagger(app);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
