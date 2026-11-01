import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreeningResultsController } from './screening-results.controller';
import { ScreeningResultsService } from './screening-results.service';
import { ScreeningResult } from './entities/screening-result.entity';
import { ScreeningSessionsModule } from '../screening-sessions/screening-sessions.module';
import { DiseasesModule } from '../diseases/diseases.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScreeningResult]),
    ScreeningSessionsModule,
    DiseasesModule,
  ],
  controllers: [ScreeningResultsController],
  providers: [ScreeningResultsService],
  exports: [ScreeningResultsService],
})
export class ScreeningResultsModule {}