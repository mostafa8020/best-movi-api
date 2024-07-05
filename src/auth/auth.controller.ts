import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

// Define example objects for Swagger documentation
class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;
}

class AuthResponse {
  @ApiProperty()
  user: UserResponse;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

@ApiTags('Authentication')
@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: AuthResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto, description: 'Json Structure For Login Object' })
  @ApiResponse({
    status: 201,
    description: 'User logged in successfully.',
    type: AuthResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: String, description: 'Refresh Token in form of String' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully.',
    type: String,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }
}
