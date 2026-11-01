import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageScansController } from './image-scans.controller';
import { ImageScansService } from './image-scans.service';
import { ImageScan } from './entities/image-scan.entity';
import { ScreeningSessionsModule } from '../screening-sessions/screening-sessions.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImageScan]), ScreeningSessionsModule],
  controllers: [ImageScansController],
  providers: [ImageScansService],
  exports: [ImageScansService],
})
export class ImageScansModule {}