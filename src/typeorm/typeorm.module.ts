import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmService } from './typeorm.service';
import { MoviesModule } from 'src/movies/movies.module';
import { Movie } from 'src/movies/entities';
import { TypeOrmModule as NestjsTypeOrm } from '@nestjs/typeorm';
import { TypeormController } from './typeorm.controller';

@Global()
@Module({
  imports: [ConfigModule, MoviesModule, NestjsTypeOrm.forFeature([Movie])],
  providers: [
    TypeOrmService,
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          const dataSource = new DataSource({
            type: configService.get<string>('DB_TYPE') as any,
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            synchronize: true,
            entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
          });
          await dataSource.initialize();
          console.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          console.log('Error connecting to database');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource, TypeOrmService],
  controllers: [TypeormController],
})
export class TypeOrmModule {}
