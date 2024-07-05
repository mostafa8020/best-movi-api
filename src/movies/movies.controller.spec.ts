import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            searchMovies: jest.fn(),
            filterMovies: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result = { data: [], page: 1, limit: 10, total: 0 };
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll(1, 10)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const movie: Movie = new Movie();
      jest.spyOn(service, 'create').mockImplementation(async () => movie);

      expect(await controller.create(movie)).toBe(movie);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);

      await expect(controller.remove(1)).resolves.toBeUndefined();
    });
  });

  describe('searchMovies', () => {
    it('should return an array of movies based on search term', async () => {
      const result = { data: [] };
      jest
        .spyOn(service, 'searchMovies')
        .mockImplementation(async () => result);

      expect(await controller.searchMovies('test')).toBe(result);
    });
  });

  describe('filterMovies', () => {
    it('should return an array of movies based on filters', async () => {
      const movies: Movie[] = [];
      jest
        .spyOn(service, 'filterMovies')
        .mockImplementation(async () => ({ movies }));

      expect(
        await controller.filterMovies(2020, 'Action', 'USA', 'Color'),
      ).toEqual({ movies });
    });
  });

  describe('findOne', () => {
    it('should return a single movie', async () => {
      const movie: Movie = new Movie();
      jest.spyOn(service, 'findOne').mockImplementation(async () => movie);

      expect(await controller.findOne(1)).toBe(movie);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const movie: Movie = new Movie();
      jest.spyOn(service, 'update').mockImplementation(async () => movie);

      expect(await controller.update(1, movie)).toBe(movie);
    });
  });
});
