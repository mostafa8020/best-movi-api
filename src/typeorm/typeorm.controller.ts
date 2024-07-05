import { Controller, Post } from '@nestjs/common';
import { TypeOrmService } from './typeorm.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('database')
@ApiBearerAuth()
@Controller('database')
export class TypeormController {
  constructor(private readonly typeormService: TypeOrmService) {}

  @ApiOperation({ summary: 'Seed the database from a CSV file' })
  @ApiResponse({
    status: 201,
    description: 'The database has been successfully seeded.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while seeding the database.',
    schema: { example: { status: 'error', message: 'error message' } },
  })
  @Post('seed')
  async seedDatabase(): Promise<void> {
    await this.typeormService.seedDatabaseFromCSV();
  }
}
