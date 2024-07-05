import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class TmdbService {
  constructor(private configService: ConfigService) {}

  async fetchMovieDetailsFromIMDB(imdbId: number): Promise<any> {
    const apiKey = this.configService.get('MOVIE_DB_API_KEY');
    const url = `https://api.themoviedb.org/3/movie/${imdbId}?api_key=${apiKey}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error fetching movie details: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details from IMDB');
    }
  }
}
