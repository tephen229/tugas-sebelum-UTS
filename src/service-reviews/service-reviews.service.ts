import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { ServiceReview } from './entities/service-review.entity';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { UpdateServiceReviewDto } from './dto/update-service-review.dto';
import { VeterinaryServicesService } from '../veterinary-services/veterinary-services.service';
import { UsersService } from '../users/users.service';
import { isPgError, PG_UNIQUE_VIOLATION } from '../common/utils/pg-error.util';

// Hanya data publik penulis yang ikut keluar (tanpa email / telepon)
const REVIEW_SELECT: FindOptionsSelect<ServiceReview> = {
  id: true,
  serviceId: true,
  userId: true,
  rating: true,
  reviewText: true,
  createdAt: true,
  user: { id: true, fullName: true, profilePhotoUrl: true },
};
const REVIEW_RELATIONS: FindOptionsRelations<ServiceReview> = { user: true };

@Injectable()
export class ServiceReviewsService {
  constructor(
    @InjectRepository(ServiceReview)
    private readonly reviewRepository: Repository<ServiceReview>,
    private readonly servicesService: VeterinaryServicesService,
    private readonly usersService: UsersService,
  ) {}

  // GET /service-reviews?serviceId=...&userId=...
  async findAll(filters: { serviceId?: string; userId?: string } = {}): Promise<ServiceReview[]> {
    const where: FindOptionsWhere<ServiceReview> = {};
    if (filters.serviceId) where.serviceId = filters.serviceId;
    if (filters.userId) where.userId = filters.userId;

    return await this.reviewRepository.find({
      where,
      select: REVIEW_SELECT,
      relations: REVIEW_RELATIONS,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<ServiceReview> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      select: REVIEW_SELECT,
      relations: REVIEW_RELATIONS,
    });
    if (!review) {
      throw new NotFoundException(`Ulasan dengan id ${id} tidak ditemukan`);
    }
    return review;
  }

  async create(dto: CreateServiceReviewDto): Promise<ServiceReview> {
    await this.servicesService.assertExists(dto.serviceId);
    await this.usersService.findById(dto.userId);

    try {
      const saved = await this.reviewRepository.save(
        this.reviewRepository.create(dto),
      );
      return await this.findById(saved.id);
    } catch (error) {
      if (isPgError(error, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('Anda sudah memberikan ulasan untuk layanan ini');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateServiceReviewDto): Promise<ServiceReview> {
    // findOneBy (tanpa select khusus) agar entity lengkap saat disimpan
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundException(`Ulasan dengan id ${id} tidak ditemukan`);
    }

    this.reviewRepository.merge(review, dto);
    await this.reviewRepository.save(review);
    return await this.findById(id);
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    await this.findById(id);
    await this.reviewRepository.delete(id);

    return {
      message: `Ulasan dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }
}