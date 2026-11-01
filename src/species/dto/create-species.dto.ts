import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSpeciesDto {
  @IsNotEmpty({ message: 'Nama spesies tidak boleh kosong' })
  @IsString({ message: 'Nama spesies harus berupa string' })
  @MaxLength(100, { message: 'Nama spesies maksimal 100 karakter' })
  readonly name: string;
}