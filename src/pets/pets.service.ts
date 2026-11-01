import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { UsersService } from '../users/users.service';
import { SpeciesService } from '../species/species.service';
import { BreedsService } from '../breeds/breeds.service';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    private readonly usersService: UsersService,
    private readonly speciesService: SpeciesService,
    private readonly breedsService: BreedsService,
  ) {}

  // GET /pets?userId=... untuk melihat hewan milik satu user
  async findAll(userId?: string): Promise<Pet[]> {
    return await this.petRepository.find({
      where: userId ? { userId } : {},
      relations: { species: true, breed: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: { species: true, breed: true },
    });
    if (!pet) {
      throw new NotFoundException(`Hewan dengan id ${id} tidak ditemukan`);
    }
    return pet;
  }

  async create(dto: CreatePetDto): Promise<Pet> {
    // validasi referensi dulu supaya pesan errornya jelas
    await this.usersService.findById(dto.userId);
    await this.speciesService.findById(dto.speciesId);
    await this.assertBreedMatchesSpecies(dto.breedId, dto.speciesId);

    const saved = await this.petRepository.save(this.petRepository.create(dto));
    return await this.findById(saved.id);
  }

  async update(id: string, dto: UpdatePetDto): Promise<Pet> {
    // sengaja tanpa relations: bila relasi ikut dimuat, TypeORM bisa memakai
    // nilai relasi lama dan mengabaikan speciesId/breedId baru saat save
    const pet = await this.petRepository.findOneBy({ id });
    if (!pet) {
      throw new NotFoundException(`Hewan dengan id ${id} tidak ditemukan`);
    }

    // nilai akhir setelah update, dipakai untuk memeriksa konsistensi ras vs spesies
    const speciesId = dto.speciesId ?? pet.speciesId;
    const breedId = dto.breedId !== undefined ? dto.breedId : pet.breedId;

    if (dto.speciesId !== undefined) {
      await this.speciesService.findById(dto.speciesId);
    }
    await this.assertBreedMatchesSpecies(breedId, speciesId);

    this.petRepository.merge(pet, dto);
    await this.petRepository.save(pet);
    return await this.findById(id);
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    await this.findById(id);
    await this.petRepository.softDelete(id);

    return {
      message: `Hewan dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }

  // Ras harus milik spesies yang sama dengan hewan (menjaga konsistensi data)
  private async assertBreedMatchesSpecies(
    breedId: string | null | undefined,
    speciesId: number,
  ): Promise<void> {
    if (!breedId) return;

    const breed = await this.breedsService.findById(breedId);
    if (breed.speciesId !== speciesId) {
      throw new BadRequestException('Ras tidak sesuai dengan spesies yang dipilih');
    }
  }
}