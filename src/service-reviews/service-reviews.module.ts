import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceReviewsController } from './service-reviews.controller';
import { ServiceReviewsService } from './service-reviews.service';
import { ServiceReview } from './entities/service-review.entity';
import { VeterinaryServicesModule } from '../veterinary-services/veterinary-services.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceReview]),
    VeterinaryServicesModule,
    UsersModule,
  ],
  controllers: [ServiceReviewsController],
  providers: [ServiceReviewsService],
  exports: [ServiceReviewsService],
})
export class ServiceReviewsModule {}