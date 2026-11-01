import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedsController } from './breeds.controller';
import { BreedsService } from './breeds.service';
import { Breed } from './entities/breed.entity';
import { SpeciesModule } from '../species/species.module';

@Module({
  imports: [TypeOrmModule.forFeature([Breed]), SpeciesModule],
  controllers: [BreedsController],
  providers: [BreedsService],
  exports: [BreedsService],
})
export class BreedsModule {}