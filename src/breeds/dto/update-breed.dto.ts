import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBreedDto } from './create-breed.dto';

// speciesId tidak boleh diubah setelah ras dibuat
export class UpdateBreedDto extends PartialType(
  OmitType(CreateBreedDto, ['speciesId'] as const),
) {}