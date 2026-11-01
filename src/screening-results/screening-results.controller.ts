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
import { ScreeningResultsService } from './screening-results.service';
import { CreateScreeningResultDto } from './dto/create-screening-result.dto';
import { UpdateScreeningResultDto } from './dto/update-screening-result.dto';

@Controller('screening-results')
export class ScreeningResultsController {
  constructor(private readonly resultsService: ScreeningResultsService) {}

  @Get()
  findAll(@Query('sessionId', new ParseUUIDPipe({ optional: true })) sessionId?: string) {
    return this.resultsService.findAll(sessionId);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateScreeningResultDto) {
    return this.resultsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateScreeningResultDto,
  ) {
    return this.resultsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultsService.remove(id);
  }
}