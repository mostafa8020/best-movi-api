import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

@Controller('movies')
@ApiTags('Movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({
    status: 200,
    description: 'List of movies retrieved successfully.',
    type: Movie,
    isArray: true,
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{ data: Movie[]; page?: number; limit?: number; total: number }> {
    return this.movieService.findAll({ page, limit });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
    type: Movie,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: Movie })
  async create(@Body() movie: Movie): Promise<Movie> {
    return this.movieService.create(movie);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.movieService.remove(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search movies by term' })
  @ApiQuery({ name: 'term', type: String })
  @ApiResponse({
    status: 200,
    description: 'Movies matching search term.',
    type: Movie,
    isArray: true,
  })
  async searchMovies(
    @Query('term') searchTerm: string,
  ): Promise<{ data: Movie[] }> {
    return this.movieService.searchMovies(searchTerm);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter movies' })
  @ApiQuery({ name: 'year', type: Number, required: false })
  @ApiQuery({ name: 'genre', type: String, required: false })
  @ApiQuery({ name: 'country', type: String, required: false })
  @ApiQuery({ name: 'color', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'Filtered list of movies.',
    type: Movie,
    isArray: true,
  })
  async filterMovies(
    @Query('year') year?: number,
    @Query('genre') genre?: string,
    @Query('country') country?: string,
    @Query('color') color?: string,
  ): Promise<{ movies: Movie[] }> {
    const filters = { year, genre, country, color };
    return this.movieService.filterMovies(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Movie retrieved successfully.',
    type: Movie,
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async findOne(@Param('id') id: number): Promise<Movie> {
    return this.movieService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a movie by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully.',
    type: Movie,
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async update(@Param('id') id: number, @Body() movie: Movie): Promise<Movie> {
    return this.movieService.update(id, movie);
  }
}
