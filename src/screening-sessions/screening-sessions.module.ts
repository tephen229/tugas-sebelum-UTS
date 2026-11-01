import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreeningSessionsController } from './screening-sessions.controller';
import { ScreeningSessionsService } from './screening-sessions.service';
import { ScreeningSession } from './entities/screening-session.entity';
import { ScreeningResult } from '../screening-results/entities/screening-result.entity';
import { PetsModule } from '../pets/pets.module';
import { UsersModule } from '../users/users.module';

@Module({
  // ScreeningResult hanya dipakai untuk menghitung jumlah hasil saat sesi diselesaikan
  imports: [
    TypeOrmModule.forFeature([ScreeningSession, ScreeningResult]),
    PetsModule,
    UsersModule,
  ],
  controllers: [ScreeningSessionsController],
  providers: [ScreeningSessionsService],
  exports: [ScreeningSessionsService],
})
export class ScreeningSessionsModule {}