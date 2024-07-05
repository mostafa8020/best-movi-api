import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Favorite } from '../../movies/entities';
import { Watchlist } from '../../movies/entities';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user',
  })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date when the user was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Watchlist, (watchlist) => watchlist.user)
  watchlist: Watchlist[];
}
