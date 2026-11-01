import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateVeterinaryServiceDto } from './create-veterinary-service.dto';

export class UpdateVeterinaryServiceDto extends PartialType(
  CreateVeterinaryServiceDto,
) {
  // Verifikasi hanya boleh dilakukan admin. Belum ada auth/role,
  // jadi nanti endpoint update perlu dilindungi guard admin.
  @IsOptional()
  @IsBoolean({ message: 'Status verifikasi harus true atau false' })
  readonly isVerified?: boolean;
}