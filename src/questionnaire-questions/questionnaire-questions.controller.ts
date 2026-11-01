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
import { QuestionnaireQuestionsService } from './questionnaire-questions.service';
import { CreateQuestionnaireQuestionDto } from './dto/create-questionnaire-question.dto';
import { UpdateQuestionnaireQuestionDto } from './dto/update-questionnaire-question.dto';
import { FindQuestionnaireQuestionsDto } from './dto/find-questionnaire-questions.dto';

@Controller('questionnaire-questions')
export class QuestionnaireQuestionsController {
  constructor(private readonly questionsService: QuestionnaireQuestionsService) {}

  @Get()
  findAll(@Query() filters: FindQuestionnaireQuestionsDto) {
    return this.questionsService.findAll(filters);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateQuestionnaireQuestionDto) {
    return this.questionsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuestionnaireQuestionDto,
  ) {
    return this.questionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.remove(id);
  }
}