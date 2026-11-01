import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServiceReviewsService } from './service-reviews.service';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { UpdateServiceReviewDto } from './dto/update-service-review.dto';

@Controller('service-reviews')
export class ServiceReviewsController {
  constructor(private readonly reviewsService: ServiceReviewsService) {}

  @Get()
  findAll(
    @Query('serviceId', new ParseUUIDPipe({ optional: true })) serviceId?: string,
    @Query('userId', new ParseUUIDPipe({ optional: true })) userId?: string,
  ) {
    return this.reviewsService.findAll({ serviceId, userId });
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateServiceReviewDto) {
    return this.reviewsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceReviewDto,
  ) {
    return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(id);
  }
}