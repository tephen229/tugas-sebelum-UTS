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
import { VeterinaryServicesService } from './veterinary-services.service';
import { CreateVeterinaryServiceDto } from './dto/create-veterinary-service.dto';
import { UpdateVeterinaryServiceDto } from './dto/update-veterinary-service.dto';
import { FindNearbyServicesDto } from './dto/find-nearby-services.dto';

@Controller('veterinary-services')
export class VeterinaryServicesController {
  constructor(private readonly servicesService: VeterinaryServicesService) {}

  @Get()
  findAll(
    @Query('serviceType') serviceType?: string,
    @Query('search') search?: string,
  ) {
    return this.servicesService.findAll({ serviceType, search });
  }

  // PENTING: harus dideklarasikan SEBELUM ':id'. Kalau tidak, kata "nearby"
  // dianggap sebagai id dan ditolak ParseUUIDPipe.
  @Get('nearby')
  findNearby(@Query() query: FindNearbyServicesDto) {
    return this.servicesService.findNearby(query);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateVeterinaryServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVeterinaryServiceDto,
  ) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }
}