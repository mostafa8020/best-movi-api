import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from '../movies/dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(
    query,
  ): Promise<{ data: Movie[]; page: number; limit: number; total: number }> {
    const { page = 1, limit = 10 } = query;
    const cacheKey = `movies:${page}:${limit}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData as string);
    }

    const [result, total] = await this.movieRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    const response = {
      data: result,
      page,
      limit,
      total,
    };

    await this.cacheManager.set(cacheKey, JSON.stringify(response), 3600);

    return response;
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new Error(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    await this.movieRepository.update(id, updateMovieDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.movieRepository.delete(id);
  }

  async searchMovies(searchTerm: string): Promise<{ data: Movie[] }> {
    const data = await this.movieRepository.find({
      where: [
        { title: ILike(`%${searchTerm}%`) },
        { director: ILike(`%${searchTerm}%`) },
      ],
    });
    return { data };
  }
  async filterMovies(
    filters: Record<string, any>,
  ): Promise<{ movies: Movie[] }> {
    const queryBuilder = this.movieRepository.createQueryBuilder('movie');

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryBuilder.andWhere(`movie.${key} = :${key}`, {
          [key]: filters[key],
        });
      }
    });

    const movies = await queryBuilder.getMany();
    return { movies };
  }
}
