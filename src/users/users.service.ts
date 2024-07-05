import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Watchlist, Favorite, Movie } from '../movies/entities';
import { TmdbService } from '../imdb/imdb.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private tmdbService: TmdbService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async addToWatchlist(user: User, movieId: number): Promise<Watchlist> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const existingWatchlistItem = await this.watchlistRepository.findOne({
      where: { user: { id: user.id }, movie: { id: movieId } },
    });

    if (existingWatchlistItem) {
      throw new Error(`Movie with ID ${movieId} is already in the watchlist`);
    }

    const watchlist = this.watchlistRepository.create({ user, movie });
    return this.watchlistRepository.save(watchlist);
  }

  async getWatchlist(user: User): Promise<{ watchList: Watchlist[] }> {
    const { id } = user;

    const watchlistItems = await this.watchlistRepository.find({
      where: { user: { id } },
      relations: {
        movie: true,
      },
    });

    return {
      watchList: watchlistItems,
    };
  }

  async markAsFavorite(userId: number, movieId: number): Promise<Favorite> {
    const user = await this.findUserById(userId);
    const movie = await this.movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const existingFavoriteItem = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, movie: { id: movieId } },
    });

    if (existingFavoriteItem) {
      throw new Error(`Movie with ID ${movieId} is already marked as favorite`);
    }

    const imdbDetails = await this.tmdbService.fetchMovieDetailsFromIMDB(
      movie.id,
    );

    const favorite = this.favoriteRepository.create({
      user,
      movie,
      imdbDetails,
    });

    return this.favoriteRepository.save(favorite);
  }
  async getFavoriteList(user: User): Promise<{ favorites: Favorite[] }> {
    const { id } = user;

    const favoriteItems = await this.favoriteRepository.find({
      where: { user: { id } },
      relations: {
        movie: true,
      },
    });

    return {
      favorites: favoriteItems,
    };
  }

  async checkFavoriteMovieStatus(user: User, favId: number): Promise<string> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id: user.id }, id: favId },
      relations: ['movie'],
    });

    if (!favorite) {
      throw new NotFoundException(
        `Favorite movie with ID ${favId} not found for user with ID ${user.id}`,
      );
    }

    const { imdbDetails } = favorite;
    if (!imdbDetails) {
      throw new NotFoundException(
        `IMDB details for movie with ID ${favId} not found`,
      );
    }

    if (imdbDetails.status === 'Released') {
      return `Congratulations! Your movie "${imdbDetails.title}" is now available at cinemas.`;
    } else {
      return `The movie "${imdbDetails.title}" is not yet released. Stay tuned for updates!`;
    }
  }
}
