import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breed } from './entities/breed.entity';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { SpeciesService } from '../species/species.service';
import {
  isPgError,
  PG_FOREIGN_KEY_VIOLATION,
  PG_UNIQUE_VIOLATION,
} from '../common/utils/pg-error.util';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
    private readonly speciesService: SpeciesService,
  ) {}

  // speciesId opsional: GET /breeds?speciesId=1 untuk memfilter ras per spesies
  async findAll(speciesId?: number): Promise<Breed[]> {
    return await this.breedRepository.find({
      where: speciesId ? { speciesId } : {},
      relations: { species: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Breed> {
    const breed = await this.breedRepository.findOne({
      where: { id },
      relations: { species: true },
    });
    if (!breed) {
      throw new NotFoundException(`Ras dengan id ${id} tidak ditemukan`);
    }
    return breed;
  }

  async create(dto: CreateBreedDto): Promise<Breed> {
    // pastikan spesiesnya ada, agar pesan error jelas (404, bukan error database)
    await this.speciesService.findById(dto.speciesId);

    try {
      const saved = await this.breedRepository.save(
        this.breedRepository.create(dto),
      );
      return await this.findById(saved.id);
    } catch (error) {
      if (isPgError(error, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('Ras dengan nama tersebut sudah ada pada spesies ini');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateBreedDto): Promise<Breed> {
    const breed = await this.breedRepository.findOneBy({ id });
    if (!breed) {
      throw new NotFoundException(`Ras dengan id ${id} tidak ditemukan`);
    }

    this.breedRepository.merge(breed, dto);

    try {
      await this.breedRepository.save(breed);
    } catch (error) {
      if (isPgError(error, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('Ras dengan nama tersebut sudah ada pada spesies ini');
      }
      throw error;
    }
    return await this.findById(id);
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    await this.findById(id);

    try {
      await this.breedRepository.delete(id);
    } catch (error) {
      if (isPgError(error, PG_FOREIGN_KEY_VIOLATION)) {
        throw new ConflictException(
          'Ras masih dipakai oleh data hewan sehingga tidak bisa dihapus',
        );
      }
      throw error;
    }

    return {
      message: `Ras dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }
}