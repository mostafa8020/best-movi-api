import { Controller, Post, UseGuards, Param, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './users.service';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from './decorators/decorators';
import { Favorite, Watchlist } from '../movies/entities';

@Controller('users')
@UseGuards(AuthGuard)
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('watchlist/:movieId')
  @ApiOperation({ summary: 'Add movie to watchlist' })
  @ApiResponse({
    status: 200,
    description: 'Successfully added to watchlist.',
    type: Watchlist,
  })
  async addToWatchlist(@CurrentUser() user, @Param('movieId') movieId: number) {
    return this.usersService.addToWatchlist(user, movieId);
  }

  @Get('watchlist')
  @ApiOperation({ summary: 'Get user watchlist' })
  @ApiResponse({
    status: 200,
    description: 'User watchlist retrieved successfully.',
    type: Watchlist,
  })
  async getWatchlist(@CurrentUser() user) {
    return this.usersService.getWatchlist(user);
  }

  @Post('favorites/:movieId')
  @ApiOperation({ summary: 'Add movie to favorites' })
  @ApiResponse({
    status: 200,
    description: 'Successfully added to favorites.',
    type: Favorite,
  })
  async addToFavorites(@CurrentUser() user, @Param('movieId') movieId: number) {
    return this.usersService.markAsFavorite(user.userId, movieId);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiResponse({
    status: 200,
    description: 'User favorites retrieved successfully.',
    type: Favorite,
  })
  async getFavorites(@CurrentUser() user) {
    return this.usersService.getFavoriteList(user);
  }

  @Get('favorites/:movieId/status')
  @ApiOperation({ summary: 'Check favorite movie status' })
  @ApiResponse({
    status: 200,
    description: 'Favorite status retrieved successfully.',
  })
  async checkFavoriteMovieStatus(
    @CurrentUser() user,
    @Param('movieId') movieId: number,
  ): Promise<string> {
    return this.usersService.checkFavoriteMovieStatus(user, movieId);
  }
}
