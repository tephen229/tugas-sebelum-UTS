import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateImageScanDto } from './create-image-scan.dto';

// Gambar tidak dipindah ke sesi lain
export class UpdateImageScanDto extends PartialType(
  OmitType(CreateImageScanDto, ['sessionId'] as const),
) {}