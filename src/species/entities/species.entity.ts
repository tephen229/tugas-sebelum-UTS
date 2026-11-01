import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Breed } from '../../breeds/entities/breed.entity';
import { Pet } from '../../pets/entities/pet.entity';

@Entity({ name: 'species' })
export class Species {
  // SMALLINT auto-increment (smallserial di PostgreSQL)
  @PrimaryGeneratedColumn('increment', { type: 'smallint' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @OneToMany(() => Breed, (breed) => breed.species)
  breeds: Breed[];

  @OneToMany(() => Pet, (pet) => pet.species)
  pets: Pet[];
}