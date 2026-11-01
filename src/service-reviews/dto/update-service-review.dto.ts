import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateServiceReviewDto } from './create-service-review.dto';

// Layanan dan penulis ulasan tidak boleh berubah. Hanya rating dan teks.
export class UpdateServiceReviewDto extends PartialType(
  PickType(CreateServiceReviewDto, ['rating', 'reviewText'] as const),
) {}