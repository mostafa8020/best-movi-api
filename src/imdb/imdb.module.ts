import { Module, forwardRef } from '@nestjs/common';
import { TmdbController } from './imdb.controller';
import { TmdbService } from './imdb.service';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [TmdbController],
  providers: [TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}
