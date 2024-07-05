import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../users.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private usersService: UserService,
    private configService: ConfigService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decodedToken: any = jwt.verify(
        token,
        this.configService.get<string>('JWT_SECRET'),
      );
      const userId = decodedToken.userId;
      if (userId) {
        const user = await this.usersService.findUserById(userId);
        request.currentUser = user;
      }
    }

    return handler.handle();
  }
}
