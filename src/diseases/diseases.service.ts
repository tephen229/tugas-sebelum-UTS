import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disease } from './entities/disease.entity';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { SpeciesService } from '../species/species.service';
import {
  isPgError,
  PG_FOREIGN_KEY_VIOLATION,
  PG_UNIQUE_VIOLATION,
} from '../common/utils/pg-error.util';

@Injectable()
export class DiseasesService {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    private readonly speciesService: SpeciesService,
  ) {}

  // speciesId opsional: GET /diseases?speciesId=1
  async findAll(speciesId?: number): Promise<Disease[]> {
    return await this.diseaseRepository.find({
      where: speciesId ? { speciesId } : {},
      relations: { species: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Disease> {
    const disease = await this.diseaseRepository.findOne({
      where: { id },
      relations: { species: true },
    });
    if (!disease) {
      throw new NotFoundException(`Penyakit dengan id ${id} tidak ditemukan`);
    }
    return disease;
  }

  async create(dto: CreateDiseaseDto): Promise<Disease> {
    await this.speciesService.findById(dto.speciesId);

    try {
      const saved = await this.diseaseRepository.save(
        this.diseaseRepository.create(dto),
      );
      return await this.findById(saved.id);
    } catch (error) {
      if (isPgError(error, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('Penyakit dengan nama tersebut sudah ada pada spesies ini');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateDiseaseDto): Promise<Disease> {
    // tanpa relations, agar speciesId baru tidak tertimpa relasi lama saat save
    const disease = await this.diseaseRepository.findOneBy({ id });
    if (!disease) {
      throw new NotFoundException(`Penyakit dengan id ${id} tidak ditemukan`);
    }

    if (dto.speciesId !== undefined) {
      await this.speciesService.findById(dto.speciesId);
    }

    this.diseaseRepository.merge(disease, dto);

    try {
      await this.diseaseRepository.save(disease);
    } catch (error) {
      if (isPgError(error, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('Penyakit dengan nama tersebut sudah ada pada spesies ini');
      }
      throw error;
    }
    return await this.findById(id);
  }

  // Tabel diseases tidak punya deleted_at, jadi dihapus permanen
  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    await this.findById(id);

    try {
      await this.diseaseRepository.delete(id);
    } catch (error) {
      if (isPgError(error, PG_FOREIGN_KEY_VIOLATION)) {
        throw new ConflictException(
          'Penyakit masih dipakai oleh hasil screening sehingga tidak bisa dihapus',
        );
      }
      throw error;
    }

    return {
      message: `Penyakit dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }
}