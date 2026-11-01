import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateImageScanDto {
  @IsNotEmpty({ message: 'Session ID tidak boleh kosong' })
  @IsUUID('4', { message: 'Session ID harus berupa UUID yang valid' })
  readonly sessionId: string;

  @IsNotEmpty({ message: 'URL gambar tidak boleh kosong' })
  @IsUrl({}, { message: 'URL gambar tidak valid' })
  @MaxLength(500, { message: 'URL gambar maksimal 500 karakter' })
  readonly imageUrl: string;

  // contoh: skin, eye, ear, wound
  @IsNotEmpty({ message: 'Tipe gambar tidak boleh kosong' })
  @IsString({ message: 'Tipe gambar harus berupa string' })
  @MaxLength(50, { message: 'Tipe gambar maksimal 50 karakter' })
  readonly imageType: string;

  @IsNotEmpty({ message: 'Nama model tidak boleh kosong' })
  @IsString({ message: 'Nama model harus berupa string' })
  @MaxLength(100, { message: 'Nama model maksimal 100 karakter' })
  readonly modelName: string;

  @IsNotEmpty({ message: 'Versi model tidak boleh kosong' })
  @IsString({ message: 'Versi model harus berupa string' })
  @MaxLength(50, { message: 'Versi model maksimal 50 karakter' })
  readonly modelVersion: string;

  @IsOptional()
  @IsObject({ message: 'Raw output harus berupa objek JSON' })
  readonly rawOutput?: Record<string, unknown>;
}