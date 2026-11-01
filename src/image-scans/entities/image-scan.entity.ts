import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScreeningSession } from '../../screening-sessions/entities/screening-session.entity';

@Entity({ name: 'image_scans' })
export class ImageScan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => ScreeningSession, (session) => session.imageScans, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: ScreeningSession;

  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageUrl: string;

  // contoh: 'skin' | 'eye' | 'ear' | 'wound'
  @Column({ name: 'image_type', type: 'varchar', length: 50 })
  imageType: string;

  @Column({ name: 'model_name', type: 'varchar', length: 100 })
  modelName: string;

  @Column({ name: 'model_version', type: 'varchar', length: 50 })
  modelVersion: string;

  @Column({ name: 'raw_output', type: 'jsonb', nullable: true })
  rawOutput: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}