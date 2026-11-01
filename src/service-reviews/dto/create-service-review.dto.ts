import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateServiceReviewDto {
  @IsNotEmpty({ message: 'Service ID tidak boleh kosong' })
  @IsUUID('4', { message: 'Service ID harus berupa UUID yang valid' })
  readonly serviceId: string;

  // Sementara lewat body. Setelah ada auth, diambil dari token login.
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  @IsUUID('4', { message: 'User ID harus berupa UUID yang valid' })
  readonly userId: string;

  @IsNotEmpty({ message: 'Rating tidak boleh kosong' })
  @IsInt({ message: 'Rating harus berupa bilangan bulat' })
  @Min(1, { message: 'Rating minimal 1' })
  @Max(5, { message: 'Rating maksimal 5' })
  readonly rating: number;

  @IsOptional()
  @IsString({ message: 'Teks ulasan harus berupa string' })
  @MaxLength(2000, { message: 'Teks ulasan maksimal 2000 karakter' })
  readonly reviewText?: string;
}