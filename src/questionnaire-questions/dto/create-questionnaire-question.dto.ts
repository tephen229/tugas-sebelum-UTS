import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export const ANSWER_TYPES = [
  'single_choice',
  'multiple_choice',
  'text',
  'number',
  'boolean',
] as const;

export class CreateQuestionnaireQuestionDto {
  @IsNotEmpty({ message: 'Teks pertanyaan tidak boleh kosong' })
  @IsString({ message: 'Teks pertanyaan harus berupa string' })
  readonly questionText: string;

  @IsNotEmpty({ message: 'Tipe jawaban tidak boleh kosong' })
  @IsIn(ANSWER_TYPES, {
    message: `Tipe jawaban harus salah satu dari: ${ANSWER_TYPES.join(', ')}`,
  })
  readonly answerType: string;

  // wajib diisi untuk single_choice / multiple_choice (dicek di service)
  @IsOptional()
  @IsArray({ message: 'Options harus berupa array' })
  @ArrayNotEmpty({ message: 'Options tidak boleh array kosong' })
  @IsString({ each: true, message: 'Setiap pilihan harus berupa string' })
  readonly options?: string[];

  @IsNotEmpty({ message: 'Kategori tidak boleh kosong' })
  @IsString({ message: 'Kategori harus berupa string' })
  @MaxLength(50, { message: 'Kategori maksimal 50 karakter' })
  readonly category: string;

  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus true atau false' })
  readonly isActive?: boolean;

  @IsOptional()
  @IsInt({ message: 'Urutan tampil harus berupa bilangan bulat' })
  @Min(0, { message: 'Urutan tampil minimal 0' })
  readonly displayOrder?: number;
}