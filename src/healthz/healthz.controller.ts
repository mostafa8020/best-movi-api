import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TypeOrmService } from 'src/typeorm/typeorm.service';

@ApiTags('healthz')
@Controller('healthz')
export class HealthzController {
  constructor(private readonly databaseService: TypeOrmService) {}

  @ApiOperation({ summary: 'Check database health status' })
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Database connection is healthy.',
    schema: { example: { status: 'ok' } },
  })
  @ApiResponse({
    status: 500,
    description: 'Database connection error.',
    schema: { example: { status: 'error', message: 'error message' } },
  })
  async checkHealth() {
    try {
      await this.databaseService.checkConnection();
      return { status: 'ok' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
