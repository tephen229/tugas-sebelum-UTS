import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import {
  isPgError,
  PG_FOREIGN_KEY_VIOLATION,
  PG_UNIQUE_VIOLATION,
} from '../common/utils/pg-error.util';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {}

  async findAll(): Promise<Species[]> {
    return await this.speciesRepository.find({ order: { name: 'ASC' } });
  }

  async findById(id: number): Promise<Species> {
    const species = await this.speciesRepository.findOneBy({ id });
    if (!species) {
      throw new NotFoundException(`Spesies dengan id ${id} tidak ditemukan`);
    }
    return species;
  }

  async create(dto: CreateSpeciesDto): Promise<Species> {
    return await this.save(this.speciesRepository.create(dto));
  }

  async update(id: number, dto: UpdateSpeciesDto): Promise<Species> {
    const species = await this.findById(id);
    this.speciesRepository.merge(species, dto);
    return await this.save(species);
  }

  // Tabel species tidak punya deleted_at, jadi dihapus permanen
  async remove(id: number): Promise<{ message: string; deletedId: number }> {
    await this.findById(id);

    try {
      await this.speciesRepository.delete(id);
    } catch (error) {
      if (isPgError(error, PG_FOREIGN_KEY_VIOLATION)) {
        throw new ConflictException(
          'Spesies masih dipakai oleh ras, hewan, atau penyakit sehingga tidak bisa dihapus',
        );
      }
      throw error;
    }

    return {
      message: `Spesies dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }

  private async save(species: Species): Promise<Species> {
    try {
      return await this.speciesRepository.save(species);
    } catch (error) {
      if (isPgError(error, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('Nama spesies sudah ada');
      }
      throw error;
    }
  }
}