import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionnaireQuestionsController } from './questionnaire-questions.controller';
import { QuestionnaireQuestionsService } from './questionnaire-questions.service';
import { QuestionnaireQuestion } from './entities/questionnaire-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionnaireQuestion])],
  controllers: [QuestionnaireQuestionsController],
  providers: [QuestionnaireQuestionsService],
  exports: [QuestionnaireQuestionsService],
})
export class QuestionnaireQuestionsModule {}