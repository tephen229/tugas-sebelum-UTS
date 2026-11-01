import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FavoriteServicesService } from './favorite-services.service';
import { CreateFavoriteServiceDto } from './dto/create-favorite-service.dto';

@Controller('favorite-services')
export class FavoriteServicesController {
  constructor(private readonly favoritesService: FavoriteServicesService) {}

  // userId wajib: tanpa auth, endpoint ini tidak boleh membuka favorit semua user
  @Get()
  findAllByUser(@Query('userId', ParseUUIDPipe) userId: string) {
    return this.favoritesService.findAllByUser(userId);
  }

  @Post()
  create(@Body() dto: CreateFavoriteServiceDto) {
    return this.favoritesService.create(dto);
  }

  @Delete(':userId/:serviceId')
  remove(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    return this.favoritesService.remove(userId, serviceId);
  }
}