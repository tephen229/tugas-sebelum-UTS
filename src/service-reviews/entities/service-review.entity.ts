import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { VeterinaryService } from '../../veterinary-services/entities/veterinary-service.entity';
import { User } from '../../users/entities/user.entity';

// Satu user hanya boleh mengulas satu layanan satu kali
@Unique(['serviceId', 'userId'])
@Check('CHK_service_reviews_rating', '"rating" BETWEEN 1 AND 5')
@Entity({ name: 'service_reviews' })
export class ServiceReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @ManyToOne(() => VeterinaryService, (service) => service.reviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: VeterinaryService;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'smallint' })
  rating: number;

  @Column({ name: 'review_text', type: 'text', nullable: true })
  reviewText: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}