import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  @IsString({ message: 'Nama lengkap harus berupa string' })
  @MaxLength(150, { message: 'Nama lengkap maksimal 150 karakter' })
  readonly fullName: string;

  // email di-trim & di-lowercase agar "A@x.com" dan "a@x.com" tidak dianggap berbeda
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @MaxLength(150, { message: 'Email maksimal 150 karakter' })
  readonly email: string;

  // password polos dari client. Di service (Langkah 5) di-hash menjadi passwordHash
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password harus berupa string' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @MaxLength(72, { message: 'Password maksimal 72 karakter' }) // batas aman bcrypt
  readonly password: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{8,15}$/, {
    message: 'Nomor telepon harus 8-15 digit, boleh diawali +',
  })
  readonly phoneNumber?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL foto profil tidak valid' })
  @MaxLength(500, { message: 'URL foto profil maksimal 500 karakter' })
  readonly profilePhotoUrl?: string;
}