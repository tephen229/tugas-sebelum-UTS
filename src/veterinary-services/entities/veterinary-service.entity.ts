import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceReview } from '../../service-reviews/entities/service-review.entity';
import { FavoriteService } from '../../favorite-services/entities/favorite-service.entity';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';

// Mempercepat query pencarian berdasarkan koordinat (Langkah 5)
@Index('IDX_vet_services_coordinates', ['latitude', 'longitude'])
@Check('CHK_vet_services_latitude', '"latitude" BETWEEN -90 AND 90')
@Check('CHK_vet_services_longitude', '"longitude" BETWEEN -180 AND 180')
@Entity({ name: 'veterinary_services' })
export class VeterinaryService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  // contoh: 'clinic' | 'hospital' | 'grooming' | 'pet_shop'
  @Column({ name: 'service_type', type: 'varchar', length: 50 })
  serviceType: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, transformer: decimalTransformer })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, transformer: decimalTransformer })
  longitude: number;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string | null;

  @Column({ name: 'whatsapp_number', type: 'varchar', length: 20, nullable: true })
  whatsappNumber: string | null;

  // contoh: { "mon": "08:00-17:00", "tue": "08:00-17:00", ... }
  @Column({ name: 'opening_hours', type: 'jsonb', nullable: true })
  openingHours: Record<string, string> | null;

  @Column({ name: 'is_24_hours', type: 'boolean', default: false })
  is24Hours: boolean;

  @Column({ name: 'website_url', type: 'varchar', length: 255, nullable: true })
  websiteUrl: string | null;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ServiceReview, (review) => review.service)
  reviews: ServiceReview[];

  @OneToMany(() => FavoriteService, (favorite) => favorite.service)
  favorites: FavoriteService[];
}