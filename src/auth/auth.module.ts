import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Favorite, Movie, Watchlist } from 'src/movies/entities';
import { TmdbModule } from 'src/imdb/imdb.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Watchlist, Favorite, Movie]),
    TmdbModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
