import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Movie } from './movie.entity';

@Entity()
@Unique(['userId', 'movieId'])
export class Watchlist {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the watchlist entry',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who added the movie to their watchlist',
  })
  @Column()
  userId: number;

  @ApiProperty({
    example: 1,
    description: "The ID of the movie added to the user's watchlist",
  })
  @Column()
  movieId: number;

  @ApiProperty({
    description: 'The user who added the movie to their watchlist',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.watchlist)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: "The movie added to the user's watchlist",
    type: () => Movie,
  })
  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;
}
