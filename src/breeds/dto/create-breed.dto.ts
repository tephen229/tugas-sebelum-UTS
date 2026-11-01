import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBreedDto {
  // species.id bertipe SMALLINT (1..32767)
  @IsNotEmpty({ message: 'Species tidak boleh kosong' })
  @IsInt({ message: 'Species ID harus berupa bilangan bulat' })
  @Min(1, { message: 'Species ID minimal 1' })
  @Max(32767, { message: 'Species ID maksimal 32767' })
  readonly speciesId: number;

  @IsNotEmpty({ message: 'Nama ras tidak boleh kosong' })
  @IsString({ message: 'Nama ras harus berupa string' })
  @MaxLength(100, { message: 'Nama ras maksimal 100 karakter' })
  readonly name: string;

  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa string' })
  readonly description?: string;
}