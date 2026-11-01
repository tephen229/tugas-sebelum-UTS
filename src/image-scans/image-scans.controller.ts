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
import { ImageScansService } from './image-scans.service';
import { CreateImageScanDto } from './dto/create-image-scan.dto';
import { UpdateImageScanDto } from './dto/update-image-scan.dto';

@Controller('image-scans')
export class ImageScansController {
  constructor(private readonly scansService: ImageScansService) {}

  @Get()
  findAll(@Query('sessionId', new ParseUUIDPipe({ optional: true })) sessionId?: string) {
    return this.scansService.findAll(sessionId);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.scansService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateImageScanDto) {
    return this.scansService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateImageScanDto,
  ) {
    return this.scansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.scansService.remove(id);
  }
}