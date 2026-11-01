import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

// GET /questionnaire-questions?category=gejala&activeOnly=true
export class FindQuestionnaireQuestionsDto {
  @IsOptional()
  @IsString({ message: 'Kategori harus berupa string' })
  readonly category?: string;

  // Memakai obj[...] karena enableImplicitConversion mengubah string "false"
  // menjadi true sebelum @Transform dijalankan (Boolean("false") === true).
  @IsOptional()
  @Transform(({ obj }) => {
    const v = obj.activeOnly;
    if (v === 'true' || v === true) return true;
    if (v === 'false' || v === false) return false;
    return v;
  })
  @IsBoolean({ message: 'activeOnly harus true atau false' })
  readonly activeOnly?: boolean;
}