import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ScreeningStatus } from '../../common/enums/screening-status.enum';

// Pet, user, dan metode tidak boleh diubah setelah sesi dibuat.
// Yang boleh berubah hanya status, keluhan, dan waktu selesai.
export class UpdateScreeningSessionDto {
  @IsOptional()
  @IsEnum(ScreeningStatus, {
    message: 'Status harus in_progress, completed, atau failed',
  })
  readonly status?: ScreeningStatus;

  @IsOptional()
  @IsString({ message: 'Keluhan utama harus berupa string' })
  @MaxLength(2000, { message: 'Keluhan utama maksimal 2000 karakter' })
  readonly chiefComplaint?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Waktu selesai harus berupa tanggal yang valid' })
  readonly completedAt?: Date;
}