import { PickType } from '@nestjs/mapped-types';
import { CreateScreeningAnswerDto } from './create-screening-answer.dto';

// Yang boleh diubah hanya nilai jawabannya (sesi & pertanyaan tetap)
export class UpdateScreeningAnswerDto extends PickType(CreateScreeningAnswerDto, [
  'answerValue',
] as const) {}