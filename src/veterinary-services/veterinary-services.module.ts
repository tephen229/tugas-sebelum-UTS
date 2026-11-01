import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeterinaryServicesController } from './veterinary-services.controller';
import { VeterinaryServicesService } from './veterinary-services.service';
import { VeterinaryService } from './entities/veterinary-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VeterinaryService])],
  controllers: [VeterinaryServicesController],
  providers: [VeterinaryServicesService],
  exports: [VeterinaryServicesService],
})
export class VeterinaryServicesModule {}