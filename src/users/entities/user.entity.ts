import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { ScreeningSession } from '../../screening-sessions/entities/screening-session.entity';
import { ServiceReview } from '../../service-reviews/entities/service-review.entity';
import { FavoriteService } from '../../favorite-services/entities/favorite-service.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  // select: false -> hash tidak ikut terambil saat find(), mencegah bocor ke response
  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string | null;

  @Column({ name: 'profile_photo_url', type: 'varchar', length: 500, nullable: true })
  profilePhotoUrl: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => Pet, (pet) => pet.user)
  pets: Pet[];

  @OneToMany(() => ScreeningSession, (session) => session.user)
  screeningSessions: ScreeningSession[];

  @OneToMany(() => ServiceReview, (review) => review.user)
  reviews: ServiceReview[];

  @OneToMany(() => FavoriteService, (favorite) => favorite.user)
  favoriteServices: FavoriteService[];
}