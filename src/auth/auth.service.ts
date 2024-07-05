import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { SignUpDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtAccessTokenExpiry: string;
  private readonly jwtRefreshTokenExpiry: string;
  private readonly saltRounds: number;
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
    this.jwtAccessTokenExpiry = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_EXPIRY',
    );
    this.jwtRefreshTokenExpiry = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXPIRY',
    );
    this.saltRounds = this.configService.get<number>('SALT_ROUNDS');
  }

  async createUser({ username, email, password }: SignUpDto): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = this.generateToken(
      newUser.id,
      newUser.email,
      this.jwtAccessTokenExpiry,
    );
    const refreshToken = this.generateToken(
      newUser.id,
      newUser.email,
      this.jwtRefreshTokenExpiry,
    );

    // TODO: send email confirmation

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateToken(
      user.id,
      user.email,
      this.jwtAccessTokenExpiry,
    );
    const refreshToken = this.generateToken(
      user.id,
      user.email,
      this.jwtRefreshTokenExpiry,
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  private generateToken(
    userId: number,
    userEmail: string,
    expiresIn: string,
  ): string {
    const payload = { userId, userEmail };
    return jwt.sign(payload, this.jwtSecret, { expiresIn });
  }
  async refreshToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded: any = jwt.verify(token, this.jwtSecret);
      const userId = decoded.userId;

      const accessToken = this.generateToken(
        userId,
        decoded.userEmail,
        this.jwtAccessTokenExpiry,
      );
      const refreshToken = this.generateToken(
        userId,
        decoded.userEmail,
        this.jwtRefreshTokenExpiry,
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      const user = await this.userService.findUserById(decoded['userId']);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
