import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Movie } from '../movies/entities/movie.entity';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';

@Injectable()
export class TypeOrmService {
  private readonly logger = new Logger(TypeOrmService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
  ) {}

  async checkConnection() {
    try {
      await this.movieRepository.query('SELECT 1');
    } catch (error) {
      throw new Error('Database connection failed');
    }
  }

  async seedDatabaseFromCSV(): Promise<void> {
    const filePath = 'seeds/movies.csv';

    const absolutePath = path.resolve(filePath);
    const movies = await this.parseCSVFile(absolutePath);

    for (const movie of movies) {
      try {
        await this.movieRepository.save(movie);
      } catch (error) {
        this.logger.log('Data has been seeded');
      }
    }
    this.logger.log('Data has been seeded');
  }

  private parseCSVFile(filePath: string): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
      const movies: Movie[] = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => movies.push(this.mapCSVDataToMovie(data)))
        .on('end', () => resolve(movies))
        .on('error', (error) => reject(error));
    });
  }

  private mapCSVDataToMovie(data): Movie {
    return {
      id: 0,
      isFavorite: false,
      pos: parseInt(data['Pos'], 10) || 0,
      rank2023: parseInt(data['2023'], 10) || 0,
      rank2022: parseInt(data['2022'], 10) || 0,
      title: data['Title'] || '',
      director: data['Director'] || '',
      year: parseInt(data['Year'], 10) || 0,
      country: data['Country'] || '',
      length: parseInt(data['Length'], 10) || 0,
      genre: data['Genre'] || '',
      colour: data['Colour'] || '',
    };
  }
}
