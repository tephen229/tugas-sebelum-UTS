import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageScan } from './entities/image-scan.entity';
import { CreateImageScanDto } from './dto/create-image-scan.dto';
import { UpdateImageScanDto } from './dto/update-image-scan.dto';
import { ScreeningSessionsService } from '../screening-sessions/screening-sessions.service';
import { ScreeningMethod } from '../common/enums/screening-method.enum';

@Injectable()
export class ImageScansService {
  constructor(
    @InjectRepository(ImageScan)
    private readonly scanRepository: Repository<ImageScan>,
    private readonly sessionsService: ScreeningSessionsService,
  ) {}

  // GET /image-scans?sessionId=...
  async findAll(sessionId?: string): Promise<ImageScan[]> {
    return await this.scanRepository.find({
      where: sessionId ? { sessionId } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<ImageScan> {
    const scan = await this.scanRepository.findOneBy({ id });
    if (!scan) {
      throw new NotFoundException(`Hasil scan gambar dengan id ${id} tidak ditemukan`);
    }
    return scan;
  }

  async create(dto: CreateImageScanDto): Promise<ImageScan> {
    await this.sessionsService.findOpenSession(dto.sessionId, ScreeningMethod.IMAGE);

    return await this.scanRepository.save(this.scanRepository.create(dto));
  }

  async update(id: string, dto: UpdateImageScanDto): Promise<ImageScan> {
    const scan = await this.findById(id);
    await this.sessionsService.findOpenSession(scan.sessionId, ScreeningMethod.IMAGE);

    this.scanRepository.merge(scan, dto);
    return await this.scanRepository.save(scan);
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    const scan = await this.findById(id);
    await this.sessionsService.findOpenSession(scan.sessionId, ScreeningMethod.IMAGE);

    await this.scanRepository.delete(id);

    return {
      message: `Hasil scan gambar dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }
}