import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Species } from '../../species/entities/species.entity';
import { ScreeningResult } from '../../screening-results/entities/screening-result.entity';

@Unique(['speciesId', 'name'])
@Entity({ name: 'diseases' })
export class Disease {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  symptoms: string[];

  @Column({ name: 'species_id', type: 'smallint' })
  speciesId: number;

  @ManyToOne(() => Species, { nullable: false })
  @JoinColumn({ name: 'species_id' })
  species: Species;

  // contoh: 'low' | 'medium' | 'high' | 'critical'
  @Column({ name: 'severity_level', type: 'varchar', length: 30 })
  severityLevel: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ScreeningResult, (result) => result.disease)
  results: ScreeningResult[];
}