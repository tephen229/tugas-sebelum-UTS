import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { VeterinaryService } from './entities/veterinary-service.entity';
import { CreateVeterinaryServiceDto } from './dto/create-veterinary-service.dto';
import { UpdateVeterinaryServiceDto } from './dto/update-veterinary-service.dto';
import { FindNearbyServicesDto } from './dto/find-nearby-services.dto';

// Layanan beserta statistik ulasan (dan jarak, khusus hasil pencarian terdekat)
export type ServiceWithStats = VeterinaryService & {
  averageRating: number | null;
  reviewCount: number;
  distanceKm?: number;
};

const EARTH_RADIUS_KM = 6371;
const KM_PER_DEGREE = 111.32;

// Rumus Haversine (jarak lingkaran besar) dalam kilometer.
// LEAST/GREATEST mencegah ACOS menerima nilai di luar -1..1 akibat pembulatan.
const DISTANCE_SQL = `
  ${EARTH_RADIUS_KM} * ACOS(LEAST(1, GREATEST(-1,
    COS(RADIANS(CAST(:lat AS double precision))) * COS(RADIANS("service"."latitude"))
    * COS(RADIANS("service"."longitude") - RADIANS(CAST(:lng AS double precision)))
    + SIN(RADIANS(CAST(:lat AS double precision))) * SIN(RADIANS("service"."latitude"))
  )))`;

const RATING_AVG_SQL = `(SELECT ROUND(CAST(AVG(r."rating") AS numeric), 2)
  FROM "service_reviews" r WHERE r."service_id" = "service"."id")`;

const REVIEW_COUNT_SQL = `(SELECT COUNT(*)
  FROM "service_reviews" r WHERE r."service_id" = "service"."id")`;

@Injectable()
export class VeterinaryServicesService {
  constructor(
    @InjectRepository(VeterinaryService)
    private readonly serviceRepository: Repository<VeterinaryService>,
  ) {}

  // GET /veterinary-services?serviceType=clinic&search=sehat
  async findAll(filters: { serviceType?: string; search?: string } = {}): Promise<ServiceWithStats[]> {
    const qb = this.serviceRepository.createQueryBuilder('service');

    if (filters.serviceType) {
      qb.andWhere('"service"."service_type" = :serviceType', {
        serviceType: filters.serviceType,
      });
    }
    if (filters.search) {
      qb.andWhere('"service"."name" ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }
    qb.orderBy('service.name', 'ASC');

    return await this.fetchWithStats(qb);
  }

  // GET /veterinary-services/nearby?latitude=..&longitude=..&radiusKm=5&limit=20
  async findNearby(dto: FindNearbyServicesDto): Promise<ServiceWithStats[]> {
    const { latitude: lat, longitude: lng } = dto;
    const radiusKm = dto.radiusKm ?? 10;
    const limit = dto.limit ?? 20;

    // Lapis 1: bounding box. Memakai indeks (latitude, longitude).
    const latDelta = radiusKm / KM_PER_DEGREE;
    const lngDelta =
      radiusKm / (KM_PER_DEGREE * Math.max(Math.cos((lat * Math.PI) / 180), 0.0001));
    const minLng = lng - lngDelta;
    const maxLng = lng + lngDelta;

    const qb = this.serviceRepository
      .createQueryBuilder('service')
      .addSelect(DISTANCE_SQL, 'distance_km')
      .setParameters({ lat, lng, radiusKm })
      .where('"service"."latitude" BETWEEN :minLat AND :maxLat', {
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
      });

    // Jika kotak melewati garis bujur +-180 (batas tanggal), lewati filter bujur.
    // Pemeriksaan jarak di bawah tetap memastikan hasilnya benar.
    if (minLng >= -180 && maxLng <= 180) {
      qb.andWhere('"service"."longitude" BETWEEN :minLng AND :maxLng', {
        minLng,
        maxLng,
      });
    }

    // Lapis 2: jarak sebenarnya (Haversine)
    qb.andWhere(`${DISTANCE_SQL} <= CAST(:radiusKm AS double precision)`);

    if (dto.serviceType) {
      qb.andWhere('"service"."service_type" = :serviceType', {
        serviceType: dto.serviceType,
      });
    }

    qb.orderBy('distance_km', 'ASC').limit(limit);

    return await this.fetchWithStats(qb);
  }

  async findById(id: string): Promise<ServiceWithStats> {
    const qb = this.serviceRepository
      .createQueryBuilder('service')
      .where('"service"."id" = :id', { id });

    const [service] = await this.fetchWithStats(qb);
    if (!service) {
      throw new NotFoundException(`Layanan dengan id ${id} tidak ditemukan`);
    }
    return service;
  }

  // Ringan: dipakai modul review dan favorit hanya untuk memastikan layanan ada
  async assertExists(id: string): Promise<void> {
    const exists = await this.serviceRepository.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`Layanan dengan id ${id} tidak ditemukan`);
    }
  }

  async create(dto: CreateVeterinaryServiceDto): Promise<ServiceWithStats> {
    const saved = await this.serviceRepository.save(
      this.serviceRepository.create(dto),
    );
    return await this.findById(saved.id);
  }

  async update(id: string, dto: UpdateVeterinaryServiceDto): Promise<ServiceWithStats> {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) {
      throw new NotFoundException(`Layanan dengan id ${id} tidak ditemukan`);
    }

    this.serviceRepository.merge(service, dto);
    await this.serviceRepository.save(service);
    return await this.findById(id);
  }

  // Tabel ini tidak punya deleted_at. Ulasan dan favorit ikut terhapus (CASCADE)
  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    await this.assertExists(id);
    await this.serviceRepository.delete(id);

    return {
      message: `Layanan dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }

  // Menambahkan rata-rata rating & jumlah ulasan, lalu menggabungkannya ke entity
  private async fetchWithStats(
    qb: SelectQueryBuilder<VeterinaryService>,
  ): Promise<ServiceWithStats[]> {
    qb.addSelect(RATING_AVG_SQL, 'avg_rating').addSelect(
      REVIEW_COUNT_SQL,
      'review_count',
    );

    const { entities, raw } = await qb.getRawAndEntities();
    const rawById = new Map<string, any>(raw.map((row) => [row.service_id, row]));

    return entities.map((entity) => {
      const row = rawById.get(entity.id);
      const result: ServiceWithStats = Object.assign(entity, {
        averageRating: row?.avg_rating != null ? Number(row.avg_rating) : null,
        reviewCount: Number(row?.review_count ?? 0),
      });
      if (row?.distance_km != null) {
        result.distanceKm = Math.round(Number(row.distance_km) * 100) / 100;
      }
      return result;
    });
  }
}