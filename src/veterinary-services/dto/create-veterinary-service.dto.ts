import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const SERVICE_TYPES = ['clinic', 'hospital', 'grooming', 'pet_shop'] as const;

const PHONE_REGEX = /^\+?[0-9]{8,15}$/;

export class CreateVeterinaryServiceDto {
  @IsNotEmpty({ message: 'Nama layanan tidak boleh kosong' })
  @IsString({ message: 'Nama layanan harus berupa string' })
  @MaxLength(200, { message: 'Nama layanan maksimal 200 karakter' })
  readonly name: string;

  @IsNotEmpty({ message: 'Tipe layanan tidak boleh kosong' })
  @IsIn(SERVICE_TYPES, {
    message: `Tipe layanan harus salah satu dari: ${SERVICE_TYPES.join(', ')}`,
  })
  readonly serviceType: string;

  @IsNotEmpty({ message: 'Alamat tidak boleh kosong' })
  @IsString({ message: 'Alamat harus berupa string' })
  readonly address: string;

  // kolom NUMERIC(10,7): rentang -90..90, maksimal 7 desimal
  @IsNotEmpty({ message: 'Latitude tidak boleh kosong' })
  @IsNumber(
    { maxDecimalPlaces: 7 },
    { message: 'Latitude harus berupa angka dengan maksimal 7 desimal' },
  )
  @Min(-90, { message: 'Latitude minimal -90' })
  @Max(90, { message: 'Latitude maksimal 90' })
  readonly latitude: number;

  // kolom NUMERIC(10,7): rentang -180..180, maksimal 7 desimal
  @IsNotEmpty({ message: 'Longitude tidak boleh kosong' })
  @IsNumber(
    { maxDecimalPlaces: 7 },
    { message: 'Longitude harus berupa angka dengan maksimal 7 desimal' },
  )
  @Min(-180, { message: 'Longitude minimal -180' })
  @Max(180, { message: 'Longitude maksimal 180' })
  readonly longitude: number;

  @IsOptional()
  @Matches(PHONE_REGEX, {
    message: 'Nomor telepon harus 8-15 digit, boleh diawali +',
  })
  readonly phoneNumber?: string;

  @IsOptional()
  @Matches(PHONE_REGEX, {
    message: 'Nomor WhatsApp harus 8-15 digit, boleh diawali +',
  })
  readonly whatsappNumber?: string;

  // contoh: { "mon": "08:00-17:00", "tue": "08:00-17:00" }
  @IsOptional()
  @IsObject({ message: 'Jam buka harus berupa objek JSON' })
  readonly openingHours?: Record<string, string>;

  @IsOptional()
  @IsBoolean({ message: 'Status 24 jam harus true atau false' })
  readonly is24Hours?: boolean;

  @IsOptional()
  @IsUrl({}, { message: 'URL website tidak valid' })
  @MaxLength(255, { message: 'URL website maksimal 255 karakter' })
  readonly websiteUrl?: string;
}