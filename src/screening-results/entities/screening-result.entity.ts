import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScreeningSession } from '../../screening-sessions/entities/screening-session.entity';
import { Disease } from '../../diseases/entities/disease.entity';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';

// confidence_score harus berupa probabilitas 0..1
@Check('CHK_screening_results_confidence', '"confidence_score" >= 0 AND "confidence_score" <= 1')
@Entity({ name: 'screening_results' })
export class ScreeningResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => ScreeningSession, (session) => session.results, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: ScreeningSession;

  @Column({ name: 'disease_id', type: 'uuid', nullable: true })
  diseaseId: string | null;

  @ManyToOne(() => Disease, (disease) => disease.results, { nullable: true })
  @JoinColumn({ name: 'disease_id' })
  disease: Disease | null;

  @Column({ name: 'prediction_label', type: 'varchar', length: 150 })
  predictionLabel: string;

  @Column({
    name: 'confidence_score',
    type: 'decimal',
    precision: 6,
    scale: 5,
    transformer: decimalTransformer,
  })
  confidenceScore: number;

  // contoh: 'low' | 'medium' | 'high'
  @Column({ name: 'risk_level', type: 'varchar', length: 30 })
  riskLevel: string;

  @Column({ type: 'text', nullable: true })
  explanation: string | null;

  @Column({ type: 'text', nullable: true })
  recommendation: string | null;

  @Column({ type: 'text' })
  disclaimer: string;

  @Column({ name: 'model_version', type: 'varchar', length: 50 })
  modelVersion: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}