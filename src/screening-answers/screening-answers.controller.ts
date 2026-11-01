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
import { ScreeningAnswersService } from './screening-answers.service';
import { CreateScreeningAnswerDto } from './dto/create-screening-answer.dto';
import { UpdateScreeningAnswerDto } from './dto/update-screening-answer.dto';

@Controller('screening-answers')
export class ScreeningAnswersController {
  constructor(private readonly answersService: ScreeningAnswersService) {}

  @Get()
  findAll(@Query('sessionId', new ParseUUIDPipe({ optional: true })) sessionId?: string) {
    return this.answersService.findAll(sessionId);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.answersService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateScreeningAnswerDto) {
    return this.answersService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateScreeningAnswerDto,
  ) {
    return this.answersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.answersService.remove(id);
  }
}