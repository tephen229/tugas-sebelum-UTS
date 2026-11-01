import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteService } from './entities/favorite-service.entity';
import { CreateFavoriteServiceDto } from './dto/create-favorite-service.dto';
import { VeterinaryServicesService } from '../veterinary-services/veterinary-services.service';
import { UsersService } from '../users/users.service';
import { isPgError, PG_UNIQUE_VIOLATION } from '../common/utils/pg-error.util';

@Injectable()
export class FavoriteServicesService {
  constructor(
    @InjectRepository(FavoriteService)
    private readonly favoriteRepository: Repository<FavoriteService>,
    private readonly servicesService: VeterinaryServicesService,
    private readonly usersService: UsersService,
  ) {}

  // GET /favorite-services?userId=... : daftar favorit satu user, terbaru dulu
  async findAllByUser(userId: string): Promise<FavoriteService[]> {
    await this.usersService.findById(userId);

    return await this.favoriteRepository.find({
      where: { userId },
      relations: { service: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateFavoriteServiceDto): Promise<FavoriteService> {
    await this.usersService.findById(dto.userId);
    await this.servicesService.assertExists(dto.serviceId);

    try {
      await this.favoriteRepository.save(this.favoriteRepository.create(dto));
    } catch (error) {
      // primary key (user_id, service_id) sudah ada
      if (isPgError(error, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('Layanan sudah ada di daftar favorit');
      }
      throw error;
    }

    return (await this.favoriteRepository.findOne({
      where: { userId: dto.userId, serviceId: dto.serviceId },
      relations: { service: true },
    })) as FavoriteService;
  }

  async remove(
    userId: string,
    serviceId: string,
  ): Promise<{ message: string; userId: string; serviceId: string }> {
    const result = await this.favoriteRepository.delete({ userId, serviceId });
    if (!result.affected) {
      throw new NotFoundException('Layanan tidak ada di daftar favorit user ini');
    }

    return {
      message: 'Layanan berhasil dihapus dari favorit',
      userId,
      serviceId,
    };
  }
}