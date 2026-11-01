import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScreeningResult } from './entities/screening-result.entity';
import { ScreeningSession } from '../screening-sessions/entities/screening-session.entity';
import { CreateScreeningResultDto } from './dto/create-screening-result.dto';
import { UpdateScreeningResultDto } from './dto/update-screening-result.dto';
import { ScreeningSessionsService } from '../screening-sessions/screening-sessions.service';
import { DiseasesService } from '../diseases/diseases.service';

@Injectable()
export class ScreeningResultsService {
  constructor(
    @InjectRepository(ScreeningResult)
    private readonly resultRepository: Repository<ScreeningResult>,
    private readonly sessionsService: ScreeningSessionsService,
    private readonly diseasesService: DiseasesService,
  ) {}

  // GET /screening-results?sessionId=...
  async findAll(sessionId?: string): Promise<ScreeningResult[]> {
    return await this.resultRepository.find({
      where: sessionId ? { sessionId } : {},
      relations: { disease: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<ScreeningResult> {
    const result = await this.resultRepository.findOne({
      where: { id },
      relations: { disease: true },
    });
    if (!result) {
      throw new NotFoundException(`Hasil screening dengan id ${id} tidak ditemukan`);
    }
    return result;
  }

  async create(dto: CreateScreeningResultDto): Promise<ScreeningResult> {
    // hasil bisa dibuat dari sesi metode apa pun, asalkan sesi masih in_progress
    const session = await this.sessionsService.findOpenSession(dto.sessionId);

    if (dto.diseaseId) {
      await this.assertDiseaseMatchesPet(dto.diseaseId, session);
    }

    const saved = await this.resultRepository.save(this.resultRepository.create(dto));
    return await this.findById(saved.id);
  }

  async update(id: string, dto: UpdateScreeningResultDto): Promise<ScreeningResult> {
    // tanpa relations agar diseaseId baru tidak tertimpa relasi lama saat save
    const result = await this.resultRepository.findOneBy({ id });
    if (!result) {
      throw new NotFoundException(`Hasil screening dengan id ${id} tidak ditemukan`);
    }

    const session = await this.sessionsService.findOpenSession(result.sessionId);

    if (dto.diseaseId) {
      await this.assertDiseaseMatchesPet(dto.diseaseId, session);
    }

    this.resultRepository.merge(result, dto);
    await this.resultRepository.save(result);
    return await this.findById(id);
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    const result = await this.findById(id);
    await this.sessionsService.findOpenSession(result.sessionId);

    await this.resultRepository.delete(id);

    return {
      message: `Hasil screening dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }

  // Penyakit yang dikaitkan harus untuk spesies yang sama dengan hewan pada sesi
  private async assertDiseaseMatchesPet(
    diseaseId: string,
    session: ScreeningSession,
  ): Promise<void> {
    const disease = await this.diseasesService.findById(diseaseId);

    if (!session.pet) {
      throw new BadRequestException('Hewan pada sesi ini sudah tidak aktif');
    }
    if (disease.speciesId !== session.pet.speciesId) {
      throw new BadRequestException(
        'Penyakit tidak sesuai dengan spesies hewan pada sesi ini',
      );
    }
  }
}