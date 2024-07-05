import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    example: 1,
    description: 'The position of the movie',
  })
  @IsInt()
  @Min(1)
  pos: number;

  @ApiProperty({
    example: 1,
    description: 'The rank in 2023',
  })
  @IsInt()
  rank2023: number;

  @ApiProperty({
    example: 1,
    description: 'The rank in 2022',
  })
  @IsInt()
  rank2022: number;

  @ApiProperty({
    example: 'The Matrix',
    description: 'The title of the movie',
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'Lana Wachowski',
    description: 'The director of the movie',
  })
  @IsString()
  @MaxLength(255)
  director: string;

  @ApiProperty({
    example: 1999,
    description: 'The year the movie was released',
  })
  @IsInt()
  @Min(1900)
  year: number;

  @ApiProperty({
    example: 'USA',
    description: 'The country of origin of the movie',
  })
  @IsString()
  @MaxLength(255)
  country: string;

  @ApiProperty({
    example: 136,
    description: 'The length of the movie in minutes',
  })
  @IsInt()
  length: number;

  @ApiProperty({
    example: 'Action',
    description: 'The genre of the movie',
  })
  @IsString()
  @MaxLength(255)
  genre: string;

  @ApiProperty({
    example: 'Color',
    description: 'The color type of the movie (e.g., Color, Black and White)',
  })
  @IsString()
  @MaxLength(255)
  colour: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the movie is marked as favorite',
  })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
