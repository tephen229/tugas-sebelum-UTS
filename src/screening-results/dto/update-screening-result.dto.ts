import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateScreeningResultDto } from './create-screening-result.dto';

// Hasil tidak dipindah ke sesi lain
export class UpdateScreeningResultDto extends PartialType(
  OmitType(CreateScreeningResultDto, ['sessionId'] as const),
) {}