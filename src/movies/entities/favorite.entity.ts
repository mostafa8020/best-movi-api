import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Movie } from './movie.entity';

@Entity()
@Unique(['userId', 'movieId'])
export class Favorite {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the favorite entry',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who marked the movie as favorite',
  })
  @Column()
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the movie marked as favorite by the user',
  })
  @Column()
  movieId: number;

  @ApiProperty({
    description: 'The user who marked the movie as favorite',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'The movie marked as favorite by the user',
    type: () => Movie,
  })
  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @ApiProperty({
    example: { imdbId: 'tt1234567', rating: 7.5 },
    description: 'Additional details from IMDb about the movie',
  })
  @Column({ type: 'jsonb', nullable: true })
  imdbDetails: any;
}
