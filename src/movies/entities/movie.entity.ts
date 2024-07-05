import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Movie {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the movie',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The position of the movie',
  })
  @Column()
  pos: number;

  @ApiProperty({
    example: 1,
    description: 'The rank in 2023',
  })
  @Column()
  rank2023: number;

  @ApiProperty({
    example: 1,
    description: 'The rank in 2022',
  })
  @Column()
  rank2022: number;

  @ApiProperty({
    example: 'The Matrix',
    description: 'The title of the movie',
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'Lana Wachowski',
    description: 'The director of the movie',
  })
  @Column()
  director: string;

  @ApiProperty({
    example: 1999,
    description: 'The year the movie was released',
  })
  @Column()
  year: number;

  @ApiProperty({
    example: 'USA',
    description: 'The country of origin of the movie',
  })
  @Column()
  country: string;

  @ApiProperty({
    example: 136,
    description: 'The length of the movie in minutes',
  })
  @Column()
  length: number;

  @ApiProperty({
    example: 'Action',
    description: 'The genre of the movie',
  })
  @Column()
  genre: string;

  @ApiProperty({
    example: 'Color',
    description: 'The color type of the movie (e.g., Color, Black and White)',
  })
  @Column()
  colour: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the movie is marked as favorite',
  })
  @Column({ default: false })
  isFavorite: boolean;
}
