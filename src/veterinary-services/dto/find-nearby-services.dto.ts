import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { SERVICE_TYPES } from './create-veterinary-service.dto';

// Dipakai sebagai query string: GET /veterinary-services/nearby?latitude=..&longitude=..
// Query string selalu berupa string, jadi @Type mengubahnya menjadi angka.
export class FindNearbyServicesDto {
  @Type(() => Number)
  @IsNotEmpty({ message: 'Latitude tidak boleh kosong' })
  @IsNumber({}, { message: 'Latitude harus berupa angka' })
  @Min(-90, { message: 'Latitude minimal -90' })
  @Max(90, { message: 'Latitude maksimal 90' })
  readonly latitude: number;

  @Type(() => Number)
  @IsNotEmpty({ message: 'Longitude tidak boleh kosong' })
  @IsNumber({}, { message: 'Longitude harus berupa angka' })
  @Min(-180, { message: 'Longitude minimal -180' })
  @Max(180, { message: 'Longitude maksimal 180' })
  readonly longitude: number;

  // radius pencarian dalam kilometer (default 10 km di service)
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Radius harus berupa angka' })
  @Min(0.1, { message: 'Radius minimal 0.1 km' })
  @Max(100, { message: 'Radius maksimal 100 km' })
  readonly radiusKm?: number;

  // jumlah hasil maksimal (default 20 di service)
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit harus berupa bilangan bulat' })
  @Min(1, { message: 'Limit minimal 1' })
  @Max(50, { message: 'Limit maksimal 50' })
  readonly limit?: number;

  @IsOptional()
  @IsIn(SERVICE_TYPES, {
    message: `Tipe layanan harus salah satu dari: ${SERVICE_TYPES.join(', ')}`,
  })
  readonly serviceType?: string;
}