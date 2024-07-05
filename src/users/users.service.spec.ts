import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Watchlist, Favorite, Movie } from '../movies/entities';
import { TmdbService } from '../imdb/imdb.service';
import { Repository } from 'typeorm';
import { UserService } from './users.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepositoryMock: Partial<Repository<User>>;
  let watchlistRepositoryMock: Partial<Repository<Watchlist>>;
  let favoriteRepositoryMock: Partial<Repository<Favorite>>;
  let movieRepositoryMock: Partial<Repository<Movie>>;
  let tmdbServiceMock: Partial<TmdbService>;

  beforeEach(async () => {
    userRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };
    watchlistRepositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    favoriteRepositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    movieRepositoryMock = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };
    tmdbServiceMock = {
      fetchMovieDetailsFromIMDB: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(Watchlist),
          useValue: watchlistRepositoryMock,
        },
        {
          provide: getRepositoryToken(Favorite),
          useValue: favoriteRepositoryMock,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: movieRepositoryMock,
        },
        {
          provide: TmdbService,
          useValue: tmdbServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const createUserDto = {
        email: 'test@test.com',
        password: 'password',
        username: 'mostafa',
      };
      const createdUser = { ...createUserDto, id: 1 };

      (userRepositoryMock.create as jest.Mock).mockReturnValue(createdUser);
      (userRepositoryMock.save as jest.Mock).mockResolvedValue(createdUser);

      expect(await service.createUser(createUserDto)).toEqual(createdUser);
      expect(userRepositoryMock.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(createdUser);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@test.com';
      const user = { id: 1, email };

      (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(user);

      expect(await service.findUserByEmail(email)).toEqual(user);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@test.com' };

      (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(user);

      expect(await service.findUserById(userId)).toEqual(user);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findUserById(userId)).rejects.toThrow(
        'User with ID 1 not found',
      );
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, email: 'test@test.com' }];

      (userRepositoryMock.find as jest.Mock).mockResolvedValue(users);

      expect(await service.findAllUsers()).toEqual(users);
      expect(userRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('addToWatchlist', () => {
    it("should add a movie to the user's watchlist", async () => {
      const user = { id: 1 } as User;
      const movieId = 1;
      const movie = { id: movieId } as Movie;
      const watchlist = { id: 1, user, movie } as Watchlist;

      (movieRepositoryMock.findOne as jest.Mock).mockResolvedValue(movie);
      (watchlistRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      (watchlistRepositoryMock.create as jest.Mock).mockReturnValue(watchlist);
      (watchlistRepositoryMock.save as jest.Mock).mockResolvedValue(watchlist);

      expect(await service.addToWatchlist(user, movieId)).toEqual(watchlist);
      expect(movieRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: movieId },
      });
      expect(watchlistRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user: { id: user.id }, movie: { id: movieId } },
      });
      expect(watchlistRepositoryMock.create).toHaveBeenCalledWith({
        user,
        movie,
      });
      expect(watchlistRepositoryMock.save).toHaveBeenCalledWith(watchlist);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const user = { id: 1 } as User;
      const movieId = 1;

      (movieRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.addToWatchlist(user, movieId)).rejects.toThrow(
        'Movie with ID 1 not found',
      );
    });

    it('should throw an error if the movie is already in the watchlist', async () => {
      const user = { id: 1 } as User;
      const movieId = 1;
      const movie = { id: movieId } as Movie;
      const existingWatchlistItem = { id: 1, user, movie } as Watchlist;

      (movieRepositoryMock.findOne as jest.Mock).mockResolvedValue(movie);
      (watchlistRepositoryMock.findOne as jest.Mock).mockResolvedValue(
        existingWatchlistItem,
      );

      await expect(service.addToWatchlist(user, movieId)).rejects.toThrow(
        'Movie with ID 1 is already in the watchlist',
      );
    });
  });

  describe('getWatchlist', () => {
    it("should return the user's watchlist", async () => {
      const user = { id: 1 } as User;
      const watchlistItems = [{ id: 1, movie: { id: 1 } }] as Watchlist[];

      (watchlistRepositoryMock.find as jest.Mock).mockResolvedValue(
        watchlistItems,
      );

      expect(await service.getWatchlist(user)).toEqual({
        watchList: watchlistItems,
      });
      expect(watchlistRepositoryMock.find).toHaveBeenCalledWith({
        where: { user: { id: user.id } },
        relations: { movie: true },
      });
    });
  });

  describe('markAsFavorite', () => {
    it('should mark a movie as favorite', async () => {
      const userId = 1;
      const movieId = 1;
      const user = { id: userId } as User;
      const movie = { id: movieId } as Movie;
      const imdbDetails = { title: 'Test Movie', status: 'Released' };
      const favorite = { id: 1, user, movie, imdbDetails } as Favorite;

      (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(user);
      (movieRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(movie);
      (favoriteRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      (
        tmdbServiceMock.fetchMovieDetailsFromIMDB as jest.Mock
      ).mockResolvedValue(imdbDetails);
      (favoriteRepositoryMock.create as jest.Mock).mockReturnValue(favorite);
      (favoriteRepositoryMock.save as jest.Mock).mockResolvedValue(favorite);

      expect(await service.markAsFavorite(userId, movieId)).toEqual(favorite);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(movieRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: movieId,
      });
      expect(favoriteRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId }, movie: { id: movieId } },
      });
      expect(tmdbServiceMock.fetchMovieDetailsFromIMDB).toHaveBeenCalledWith(
        movie.id,
      );
      expect(favoriteRepositoryMock.create).toHaveBeenCalledWith({
        user,
        movie,
        imdbDetails,
      });
      expect(favoriteRepositoryMock.save).toHaveBeenCalledWith(favorite);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const userId = 1;
      const movieId = 1;

      (userRepositoryMock.findOne as jest.Mock).mockResolvedValue({
        id: userId,
      });
      (movieRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.markAsFavorite(userId, movieId)).rejects.toThrow(
        'Movie with ID 1 not found',
      );
    });

    it('should throw an error if the movie is already marked as favorite', async () => {
      const userId = 1;
      const movieId = 1;
      const favoriteItem = { id: 1 } as Favorite;

      (userRepositoryMock.findOne as jest.Mock).mockResolvedValue({
        id: userId,
      });
      (movieRepositoryMock.findOneBy as jest.Mock).mockResolvedValue({
        id: movieId,
      });
      (favoriteRepositoryMock.findOne as jest.Mock).mockResolvedValue(
        favoriteItem,
      );

      await expect(service.markAsFavorite(userId, movieId)).rejects.toThrow(
        'Movie with ID 1 is already marked as favorite',
      );
    });
  });

  describe('getFavoriteList', () => {
    it("should return the user's favorite list", async () => {
      const user = { id: 1 } as User;
      const favoriteItems = [{ id: 1, movie: { id: 1 } }] as Favorite[];

      (favoriteRepositoryMock.find as jest.Mock).mockResolvedValue(
        favoriteItems,
      );

      expect(await service.getFavoriteList(user)).toEqual({
        favorites: favoriteItems,
      });
      expect(favoriteRepositoryMock.find).toHaveBeenCalledWith({
        where: { user: { id: user.id } },
        relations: { movie: true },
      });
    });
  });

  describe('checkFavoriteMovieStatus', () => {
    it('should return a message if the movie is released', async () => {
      const user = { id: 1 } as User;
      const favId = 1;
      const favorite = {
        id: favId,
        imdbDetails: { title: 'Test Movie', status: 'Released' },
      } as Favorite;

      (favoriteRepositoryMock.findOne as jest.Mock).mockResolvedValue(favorite);

      expect(await service.checkFavoriteMovieStatus(user, favId)).toEqual(
        `Congratulations! Your movie "Test Movie" is now available at cinemas.`,
      );
      expect(favoriteRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user: { id: user.id }, id: favId },
        relations: ['movie'],
      });
    });

    it('should return a message if the movie is not released', async () => {
      const user = { id: 1 } as User;
      const favId = 1;
      const favorite = {
        id: favId,
        imdbDetails: { title: 'Test Movie', status: 'Not Released' },
      } as Favorite;

      (favoriteRepositoryMock.findOne as jest.Mock).mockResolvedValue(favorite);

      expect(await service.checkFavoriteMovieStatus(user, favId)).toEqual(
        `The movie "Test Movie" is not yet released. Stay tuned for updates!`,
      );
    });

    it('should throw NotFoundException if favorite movie is not found', async () => {
      const user = { id: 1 } as User;
      const favId = 1;

      (favoriteRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.checkFavoriteMovieStatus(user, favId),
      ).rejects.toThrow(
        `Favorite movie with ID ${favId} not found for user with ID ${user.id}`,
      );
    });

    it('should throw NotFoundException if IMDB details are not found', async () => {
      const user = { id: 1 } as User;
      const favId = 1;
      const favorite = { id: favId, imdbDetails: null } as Favorite;

      (favoriteRepositoryMock.findOne as jest.Mock).mockResolvedValue(favorite);

      await expect(
        service.checkFavoriteMovieStatus(user, favId),
      ).rejects.toThrow(`IMDB details for movie with ID ${favId} not found`);
    });
  });
});
