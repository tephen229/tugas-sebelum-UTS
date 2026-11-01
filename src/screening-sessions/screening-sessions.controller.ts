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
import { ScreeningSessionsService } from './screening-sessions.service';
import { CreateScreeningSessionDto } from './dto/create-screening-session.dto';
import { UpdateScreeningSessionDto } from './dto/update-screening-session.dto';
import { FindScreeningSessionsDto } from './dto/find-screening-sessions.dto';

@Controller('screening-sessions')
export class ScreeningSessionsController {
  constructor(private readonly sessionsService: ScreeningSessionsService) {}

  @Get()
  findAll(@Query() filters: FindScreeningSessionsDto) {
    return this.sessionsService.findAll(filters);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateScreeningSessionDto) {
    return this.sessionsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateScreeningSessionDto,
  ) {
    return this.sessionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionsService.remove(id);
  }
}