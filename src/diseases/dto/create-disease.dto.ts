import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'] as const;

export class CreateDiseaseDto {
  @IsNotEmpty({ message: 'Nama penyakit tidak boleh kosong' })
  @IsString({ message: 'Nama penyakit harus berupa string' })
  @MaxLength(150, { message: 'Nama penyakit maksimal 150 karakter' })
  readonly name: string;

  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa string' })
  readonly description?: string;

  @IsOptional()
  @IsArray({ message: 'Gejala harus berupa array' })
  @IsString({ each: true, message: 'Setiap gejala harus berupa string' })
  readonly symptoms?: string[];

  @IsNotEmpty({ message: 'Spesies tidak boleh kosong' })
  @IsInt({ message: 'Species ID harus berupa bilangan bulat' })
  @Min(1, { message: 'Species ID minimal 1' })
  @Max(32767, { message: 'Species ID maksimal 32767' })
  readonly speciesId: number;

  @IsNotEmpty({ message: 'Tingkat keparahan tidak boleh kosong' })
  @IsIn(SEVERITY_LEVELS, {
    message: `Tingkat keparahan harus salah satu dari: ${SEVERITY_LEVELS.join(', ')}`,
  })
  readonly severityLevel: string;
}