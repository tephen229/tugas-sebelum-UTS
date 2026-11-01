import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VeterinaryService } from '../../veterinary-services/entities/veterinary-service.entity';

// Composite primary key (user_id, service_id), seperti book_authors di PDF
@Entity({ name: 'favorite_services' })
export class FavoriteService {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @PrimaryColumn({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @ManyToOne(() => User, (user) => user.favoriteServices, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => VeterinaryService, (service) => service.favorites, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: VeterinaryService;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}