import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionnaireQuestionDto } from './create-questionnaire-question.dto';

export class UpdateQuestionnaireQuestionDto extends PartialType(
  CreateQuestionnaireQuestionDto,
) {}