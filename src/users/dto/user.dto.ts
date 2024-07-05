import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
