import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';

import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite, Movie, Watchlist } from 'src/movies/entities';
import { MoviesModule } from 'src/movies/movies.module';
import { TmdbModule } from 'src/imdb/imdb.module';
import { TestingModule } from '@nestjs/testing';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Favorite, Watchlist, Movie]),
    forwardRef(() => AuthModule),
    MoviesModule,
    TmdbModule,
    TestingModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
