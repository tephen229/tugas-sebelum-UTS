import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Species } from '../../species/entities/species.entity';
import { Breed } from '../../breeds/entities/breed.entity';
import { ScreeningSession } from '../../screening-sessions/entities/screening-session.entity';
import { PetSex } from '../../common/enums/pet-sex.enum';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';

@Entity({ name: 'pets' })
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.pets, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'species_id', type: 'smallint' })
  speciesId: number;

  @ManyToOne(() => Species, (species) => species.pets, { nullable: false })
  @JoinColumn({ name: 'species_id' })
  species: Species;

  @Column({ name: 'breed_id', type: 'uuid', nullable: true })
  breedId: string | null;

  @ManyToOne(() => Breed, (breed) => breed.pets, { nullable: true })
  @JoinColumn({ name: 'breed_id' })
  breed: Breed | null;

  @Column({ type: 'enum', enum: PetSex, default: PetSex.UNKNOWN })
  sex: PetSex;

  // tipe 'date' dikembalikan sebagai string 'YYYY-MM-DD'
  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: string | null;

  @Column({
    name: 'weight_kg',
    type: 'decimal',
    precision: 5,
    scale: 2,
    transformer: decimalTransformer,
  })
  weightKg: number;

  @Column({ name: 'photo_url', type: 'varchar', length: 500, nullable: true })
  photoUrl: string | null;

  @Column({ name: 'is_neutered', type: 'boolean', default: false })
  isNeutered: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => ScreeningSession, (session) => session.pet)
  screeningSessions: ScreeningSession[];
}