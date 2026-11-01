import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseasesController } from './diseases.controller';
import { DiseasesService } from './diseases.service';
import { Disease } from './entities/disease.entity';
import { SpeciesModule } from '../species/species.module';

@Module({
  imports: [TypeOrmModule.forFeature([Disease]), SpeciesModule],
  controllers: [DiseasesController],
  providers: [DiseasesService],
  exports: [DiseasesService],
})
export class DiseasesModule {}