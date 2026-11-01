import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';

// userId tidak boleh diubah: hewan tidak berpindah pemilik lewat endpoint update
export class UpdatePetDto extends PartialType(OmitType(CreatePetDto, ['userId'] as const)) {}