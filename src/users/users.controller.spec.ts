import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Watchlist, Favorite, Movie } from '../movies/entities';
import { TmdbService } from '../imdb/imdb.service';
import { Repository } from 'typeorm';
import { UserController } from './users.controller';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('UserController', () => {
  let controller: UserController;
  let userServiceMock: Partial<UserService>;

  beforeEach(async () => {
    userServiceMock = {
      addToWatchlist: jest.fn(),
      getWatchlist: jest.fn(),
      markAsFavorite: jest.fn(),
      getFavoriteList: jest.fn(),
      checkFavoriteMovieStatus: jest.fn(),
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      findAllUsers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Watchlist),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Favorite),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        TmdbService,
        ConfigService,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToWatchlist', () => {
    it('should add a movie to the user watchlist', async () => {
      const user: User = {
        id: 1,
        username: 'test',
        email: 'email@domain.com',
        password: 'password',
        createdAt: new Date(),
        favorites: [],
        watchlist: [],
      };
      const movieId = 1;
      const watchlistItem: Watchlist = {
        id: 1,
        userId: user.id,
        movieId: movieId,
        user,
        movie: {
          id: movieId,
          userId: user.id,
        } as unknown as Movie,
      };

      (userServiceMock.addToWatchlist as jest.Mock).mockResolvedValue(
        watchlistItem,
      );

      await expect(controller.addToWatchlist(user, movieId)).resolves.toEqual(
        watchlistItem,
      );
      expect(userServiceMock.addToWatchlist).toHaveBeenCalledWith(
        user,
        movieId,
      );
    });
  });

  describe('getWatchlist', () => {
    it('should return the user watchlist', async () => {
      const user: User = {
        id: 1,
        username: 'test',
        email: 'email@domain.com',
        password: 'password',
        createdAt: new Date(),
        favorites: [],
        watchlist: [],
      };
      const movieId = 1;

      const watchlistItem: Watchlist = {
        id: 1,
        userId: user.id,
        movieId: movieId,
        user,
        movie: {
          id: movieId,
          userId: user.id,
        } as unknown as Movie,
      };

      (userServiceMock.getWatchlist as jest.Mock).mockResolvedValue({
        watchList: watchlistItem,
      });

      await expect(controller.getWatchlist(user)).resolves.toEqual({
        watchList: watchlistItem,
      });
      expect(userServiceMock.getWatchlist).toHaveBeenCalledWith(user);
    });
  });
  describe('getFavorites', () => {
    it('should return the user favorite list', async () => {
      const user: User = {
        id: 1,
        username: 'test',
        email: 'email@domain.com',
        password: 'password',
        createdAt: new Date(),
        favorites: [],
        watchlist: [],
      };
      const movieId = 1;
      const favoriteItem: Favorite = {
        id: 1,
        userId: user.id,
        movieId: movieId,
        user,
        movie: {
          id: movieId,
          userId: user.id,
        } as unknown as Movie,
        imdbDetails: {},
      };

      (userServiceMock.getFavoriteList as jest.Mock).mockResolvedValue({
        favoriteItem,
      });

      await expect(controller.getFavorites(user)).resolves.toEqual({
        favoriteItem,
      });
      expect(userServiceMock.getFavoriteList).toHaveBeenCalledWith(user);
    });
  });

  describe('checkFavoriteMovieStatus', () => {
    it('should return the status message if the movie is released', async () => {
      const user: User = {
        id: 1,
        username: 'test',
        email: 'email@domain.com',
        password: 'password',
        createdAt: new Date(),
        favorites: [],
        watchlist: [],
      };
      const movieId = 1;
      const message =
        'Congratulations! Your movie "Test Movie" is now available at cinemas.';

      (userServiceMock.checkFavoriteMovieStatus as jest.Mock).mockResolvedValue(
        message,
      );

      await expect(
        controller.checkFavoriteMovieStatus(user, movieId),
      ).resolves.toEqual(message);
      expect(userServiceMock.checkFavoriteMovieStatus).toHaveBeenCalledWith(
        user,
        movieId,
      );
    });

    it('should throw NotFoundException if the movie is not found in favorites', async () => {
      const user = { id: 1 };
      const movieId = 1;

      (userServiceMock.checkFavoriteMovieStatus as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        controller.checkFavoriteMovieStatus(user, movieId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
