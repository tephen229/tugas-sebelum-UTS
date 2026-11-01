import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreeningAnswersController } from './screening-answers.controller';
import { ScreeningAnswersService } from './screening-answers.service';
import { ScreeningAnswer } from './entities/screening-answer.entity';
import { ScreeningSessionsModule } from '../screening-sessions/screening-sessions.module';
import { QuestionnaireQuestionsModule } from '../questionnaire-questions/questionnaire-questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScreeningAnswer]),
    ScreeningSessionsModule,
    QuestionnaireQuestionsModule,
  ],
  controllers: [ScreeningAnswersController],
  providers: [ScreeningAnswersService],
  exports: [ScreeningAnswersService],
})
export class ScreeningAnswersModule {}