import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { Pet } from './entities/pet.entity';
import { UsersModule } from '../users/users.module';
import { SpeciesModule } from '../species/species.module';
import { BreedsModule } from '../breeds/breeds.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pet]), UsersModule, SpeciesModule, BreedsModule],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}