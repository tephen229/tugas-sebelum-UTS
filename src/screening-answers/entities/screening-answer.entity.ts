import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ScreeningSession } from '../../screening-sessions/entities/screening-session.entity';
import { QuestionnaireQuestion } from '../../questionnaire-questions/entities/questionnaire-question.entity';

// Satu pertanyaan hanya dijawab sekali per sesi
@Unique(['sessionId', 'questionId'])
@Entity({ name: 'screening_answers' })
export class ScreeningAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => ScreeningSession, (session) => session.answers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: ScreeningSession;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => QuestionnaireQuestion, (question) => question.answers, {
    nullable: false,
  })
  @JoinColumn({ name: 'question_id' })
  question: QuestionnaireQuestion;

  @Column({ name: 'answer_value', type: 'jsonb' })
  answerValue: unknown;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}