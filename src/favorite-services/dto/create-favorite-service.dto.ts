import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFavoriteServiceDto {
  // Sementara lewat body. Setelah ada auth, diambil dari token login.
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  @IsUUID('4', { message: 'User ID harus berupa UUID yang valid' })
  readonly userId: string;

  @IsNotEmpty({ message: 'Service ID tidak boleh kosong' })
  @IsUUID('4', { message: 'Service ID harus berupa UUID yang valid' })
  readonly serviceId: string;
}