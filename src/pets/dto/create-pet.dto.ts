import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PetSex } from '../../common/enums/pet-sex.enum';

export class CreatePetDto {
  // Sementara dikirim lewat body. Setelah ada modul auth, nilai ini diambil dari token login.
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  @IsUUID('4', { message: 'User ID harus berupa UUID yang valid' })
  readonly userId: string;

  @IsNotEmpty({ message: 'Nama hewan tidak boleh kosong' })
  @IsString({ message: 'Nama hewan harus berupa string' })
  @MaxLength(100, { message: 'Nama hewan maksimal 100 karakter' })
  readonly name: string;

  @IsNotEmpty({ message: 'Spesies tidak boleh kosong' })
  @IsInt({ message: 'Species ID harus berupa bilangan bulat' })
  @Min(1, { message: 'Species ID minimal 1' })
  @Max(32767, { message: 'Species ID maksimal 32767' })
  readonly speciesId: number;

  // ras boleh kosong (misalnya hewan campuran / tidak diketahui)
  @IsOptional()
  @IsUUID('4', { message: 'Breed ID harus berupa UUID yang valid' })
  readonly breedId?: string;

  @IsOptional()
  @IsEnum(PetSex, { message: 'Jenis kelamin harus male, female, atau unknown' })
  readonly sex?: PetSex;

  // format YYYY-MM-DD
  @IsOptional()
  @IsDateString({}, { message: 'Tanggal lahir harus berformat YYYY-MM-DD' })
  readonly birthDate?: string;

  // kolom NUMERIC(5,2) -> maksimal 999.99 dengan 2 angka desimal
  @IsNotEmpty({ message: 'Berat badan tidak boleh kosong' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Berat badan harus berupa angka dengan maksimal 2 desimal' },
  )
  @Min(0.01, { message: 'Berat badan harus lebih dari 0' })
  @Max(999.99, { message: 'Berat badan maksimal 999.99 kg' })
  readonly weightKg: number;

  @IsOptional()
  @IsUrl({}, { message: 'URL foto tidak valid' })
  @MaxLength(500, { message: 'URL foto maksimal 500 karakter' })
  readonly photoUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'Status steril harus true atau false' })
  readonly isNeutered?: boolean;
}