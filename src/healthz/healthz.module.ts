import { Module } from '@nestjs/common';
import { HealthzController } from './healthz.controller';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { MoviesModule } from 'src/movies/movies.module';
import { Movie } from 'src/movies/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [MoviesModule, TypeOrmModule.forFeature([Movie])],
  controllers: [HealthzController],
  providers: [TypeOrmService],
})
export class HealthzModule {}
