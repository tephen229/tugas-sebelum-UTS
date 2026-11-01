import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ScreeningMethod } from '../../common/enums/screening-method.enum';

export class CreateScreeningSessionDto {
  @IsNotEmpty({ message: 'Pet ID tidak boleh kosong' })
  @IsUUID('4', { message: 'Pet ID harus berupa UUID yang valid' })
  readonly petId: string;

  // Sementara lewat body. Setelah ada auth, diambil dari token login.
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  @IsUUID('4', { message: 'User ID harus berupa UUID yang valid' })
  readonly userId: string;

  @IsNotEmpty({ message: 'Metode screening tidak boleh kosong' })
  @IsEnum(ScreeningMethod, {
    message: 'Metode harus questionnaire, chat, atau image',
  })
  readonly method: ScreeningMethod;

  @IsOptional()
  @IsString({ message: 'Keluhan utama harus berupa string' })
  @MaxLength(2000, { message: 'Keluhan utama maksimal 2000 karakter' })
  readonly chiefComplaint?: string;
}