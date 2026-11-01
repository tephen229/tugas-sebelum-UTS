import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteServicesController } from './favorite-services.controller';
import { FavoriteServicesService } from './favorite-services.service';
import { FavoriteService } from './entities/favorite-service.entity';
import { VeterinaryServicesModule } from '../veterinary-services/veterinary-services.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoriteService]),
    VeterinaryServicesModule,
    UsersModule,
  ],
  controllers: [FavoriteServicesController],
  providers: [FavoriteServicesService],
  exports: [FavoriteServicesService],
})
export class FavoriteServicesModule {}