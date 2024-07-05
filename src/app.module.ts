import { Module } from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import { UserModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HealthzModule } from './healthz/healthz.module';
import { TypeOrmModule } from './typeorm/typeorm.module';
import { MoviesModule } from './movies/movies.module';
import { TmdbModule } from './imdb/imdb.module';

@Module({
  imports: [
    GlobalModule,
    UserModule,
    SharedModule,
    AuthModule,
    HealthzModule,
    TypeOrmModule,
    MoviesModule,
    TmdbModule,
  ],
})
export class AppModule {}
