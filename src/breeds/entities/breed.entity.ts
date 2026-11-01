import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Species } from '../../species/entities/species.entity';
import { Pet } from '../../pets/entities/pet.entity';

// Satu spesies tidak boleh punya dua ras bernama sama
@Unique(['speciesId', 'name'])
@Entity({ name: 'breeds' })
export class Breed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'species_id', type: 'smallint' })
  speciesId: number;

  @ManyToOne(() => Species, (species) => species.breeds, { nullable: false })
  @JoinColumn({ name: 'species_id' })
  species: Species;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => Pet, (pet) => pet.breed)
  pets: Pet[];
}