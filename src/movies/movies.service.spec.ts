import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie> = {} as unknown as Repository<Movie>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            findAndCount: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockReturnThis(),
            })),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(movieRepository).toBeDefined();
    expect(cacheManager).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of movies', async () => {
      const result = {
        data: [],
        page: 1,
        limit: 10,
        total: 0,
      };
      jest.spyOn(movieRepository, 'findAndCount').mockResolvedValue([[], 0]);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

      expect(await service.findAll({})).toEqual(result);
    });
  });

  describe('MoviesService', () => {
    let service: MoviesService;
    let movieRepository: Repository<Movie>;
    let cacheManager: Cache;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          MoviesService,
          {
            provide: getRepositoryToken(Movie),
            useValue: {
              findAndCount: jest.fn(),
              findOneBy: jest.fn(),
              create: jest.fn(),
              save: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              find: jest.fn(),
              createQueryBuilder: jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockReturnThis(),
              })),
            },
          },
          {
            provide: CACHE_MANAGER,
            useValue: {
              get: jest.fn(),
              set: jest.fn(),
            },
          },
        ],
      }).compile();

      service = module.get<MoviesService>(MoviesService);
      movieRepository = module.get<Repository<Movie>>(
        getRepositoryToken(Movie),
      );
      cacheManager = module.get<Cache>(CACHE_MANAGER);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(movieRepository).toBeDefined();
      expect(cacheManager).toBeDefined();
    });

    describe('findAll', () => {
      it('should return a list of movies', async () => {
        const result = {
          data: [],
          page: 1,
          limit: 10,
          total: 0,
        };
        jest.spyOn(movieRepository, 'findAndCount').mockResolvedValue([[], 0]);
        jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

        expect(await service.findAll({})).toEqual(result);
      });
    });
  });
});
