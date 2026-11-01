import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { User } from '../../users/entities/user.entity';
import { ScreeningAnswer } from '../../screening-answers/entities/screening-answer.entity';
import { ChatMessage } from '../../chat-messages/entities/chat-message.entity';
import { ImageScan } from '../../image-scans/entities/image-scan.entity';
import { ScreeningResult } from '../../screening-results/entities/screening-result.entity';
import { ScreeningMethod } from '../../common/enums/screening-method.enum';
import { ScreeningStatus } from '../../common/enums/screening-status.enum';

@Entity({ name: 'screening_sessions' })
export class ScreeningSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'pet_id', type: 'uuid' })
  petId: string;

  @ManyToOne(() => Pet, (pet) => pet.screeningSessions, { nullable: false })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.screeningSessions, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ScreeningMethod })
  method: ScreeningMethod;

  @Column({ type: 'enum', enum: ScreeningStatus, default: ScreeningStatus.IN_PROGRESS })
  status: ScreeningStatus;

  @Column({ name: 'chief_complaint', type: 'text', nullable: true })
  chiefComplaint: string | null;

  @CreateDateColumn({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @OneToMany(() => ScreeningAnswer, (answer) => answer.session)
  answers: ScreeningAnswer[];

  @OneToMany(() => ChatMessage, (message) => message.session)
  chatMessages: ChatMessage[];

  @OneToMany(() => ImageScan, (scan) => scan.session)
  imageScans: ImageScan[];

  @OneToMany(() => ScreeningResult, (result) => result.session)
  results: ScreeningResult[];
}