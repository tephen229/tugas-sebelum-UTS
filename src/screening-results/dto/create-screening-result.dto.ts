import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const RISK_LEVELS = ['low', 'medium', 'high'] as const;

export class CreateScreeningResultDto {
  @IsNotEmpty({ message: 'Session ID tidak boleh kosong' })
  @IsUUID('4', { message: 'Session ID harus berupa UUID yang valid' })
  readonly sessionId: string;

  // kosong jika prediksi tidak cocok dengan penyakit di tabel diseases
  @IsOptional()
  @IsUUID('4', { message: 'Disease ID harus berupa UUID yang valid' })
  readonly diseaseId?: string;

  @IsNotEmpty({ message: 'Label prediksi tidak boleh kosong' })
  @IsString({ message: 'Label prediksi harus berupa string' })
  @MaxLength(150, { message: 'Label prediksi maksimal 150 karakter' })
  readonly predictionLabel: string;

  // kolom NUMERIC(6,5): probabilitas 0..1 dengan maksimal 5 desimal
  @IsNotEmpty({ message: 'Confidence score tidak boleh kosong' })
  @IsNumber(
    { maxDecimalPlaces: 5 },
    { message: 'Confidence score harus berupa angka dengan maksimal 5 desimal' },
  )
  @Min(0, { message: 'Confidence score minimal 0' })
  @Max(1, { message: 'Confidence score maksimal 1' })
  readonly confidenceScore: number;

  @IsNotEmpty({ message: 'Tingkat risiko tidak boleh kosong' })
  @IsIn(RISK_LEVELS, {
    message: `Tingkat risiko harus salah satu dari: ${RISK_LEVELS.join(', ')}`,
  })
  readonly riskLevel: string;

  @IsOptional()
  @IsString({ message: 'Penjelasan harus berupa string' })
  readonly explanation?: string;

  @IsOptional()
  @IsString({ message: 'Rekomendasi harus berupa string' })
  readonly recommendation?: string;

  @IsNotEmpty({ message: 'Disclaimer tidak boleh kosong' })
  @IsString({ message: 'Disclaimer harus berupa string' })
  readonly disclaimer: string;

  @IsNotEmpty({ message: 'Versi model tidak boleh kosong' })
  @IsString({ message: 'Versi model harus berupa string' })
  @MaxLength(50, { message: 'Versi model maksimal 50 karakter' })
  readonly modelVersion: string;
}