import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ScreeningAnswer } from '../../screening-answers/entities/screening-answer.entity';

@Entity({ name: 'questionnaire_questions' })
export class QuestionnaireQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  // contoh: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'boolean'
  @Column({ name: 'answer_type', type: 'varchar', length: 30 })
  answerType: string;

  // daftar pilihan jawaban, null jika answer_type bebas (text/number)
  @Column({ type: 'jsonb', nullable: true })
  options: string[] | null;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @OneToMany(() => ScreeningAnswer, (answer) => answer.question)
  answers: ScreeningAnswer[];
}