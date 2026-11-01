import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ScreeningSession } from './entities/screening-session.entity';
import { ScreeningResult } from '../screening-results/entities/screening-result.entity';
import { CreateScreeningSessionDto } from './dto/create-screening-session.dto';
import { UpdateScreeningSessionDto } from './dto/update-screening-session.dto';
import { FindScreeningSessionsDto } from './dto/find-screening-sessions.dto';
import { PetsService } from '../pets/pets.service';
import { UsersService } from '../users/users.service';
import { ScreeningMethod } from '../common/enums/screening-method.enum';
import { ScreeningStatus } from '../common/enums/screening-status.enum';

@Injectable()
export class ScreeningSessionsService {
  constructor(
    @InjectRepository(ScreeningSession)
    private readonly sessionRepository: Repository<ScreeningSession>,
    @InjectRepository(ScreeningResult)
    private readonly resultRepository: Repository<ScreeningResult>,
    private readonly petsService: PetsService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(filters: FindScreeningSessionsDto = {}): Promise<ScreeningSession[]> {
    const where: FindOptionsWhere<ScreeningSession> = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.petId) where.petId = filters.petId;
    if (filters.status) where.status = filters.status;

    return await this.sessionRepository.find({
      where,
      relations: { pet: true },
      order: { startedAt: 'DESC' },
    });
  }

  // Detail lengkap satu sesi: hewan, jawaban, chat, scan, dan hasil
  async findById(id: string): Promise<ScreeningSession> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: {
        pet: true,
        answers: { question: true },
        chatMessages: true,
        imageScans: true,
        results: { disease: true },
      },
      order: {
        answers: { createdAt: 'ASC' },
        chatMessages: { createdAt: 'ASC' },
        imageScans: { createdAt: 'ASC' },
        results: { createdAt: 'DESC' },
      },
    });
    if (!session) {
      throw new NotFoundException(`Sesi screening dengan id ${id} tidak ditemukan`);
    }
    return session;
  }

  // Dipakai modul anak. Sesi harus ada, berstatus in_progress, dan (opsional) bermetode tertentu.
  async findOpenSession(id: string, method?: ScreeningMethod): Promise<ScreeningSession> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: { pet: true },
    });
    if (!session) {
      throw new NotFoundException(`Sesi screening dengan id ${id} tidak ditemukan`);
    }
    if (session.status !== ScreeningStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Sesi sudah selesai atau gagal sehingga datanya tidak dapat diubah',
      );
    }
    if (method && session.method !== method) {
      throw new BadRequestException(
        `Sesi ini memakai metode ${session.method}, bukan ${method}`,
      );
    }
    return session;
  }

  async create(dto: CreateScreeningSessionDto): Promise<ScreeningSession> {
    const pet = await this.petsService.findById(dto.petId);
    await this.usersService.findById(dto.userId);

    // menjaga dua sumber kebenaran pemilik (pets.user_id vs screening_sessions.user_id)
    if (pet.userId !== dto.userId) {
      throw new ForbiddenException('Hewan ini bukan milik user tersebut');
    }

    const saved = await this.sessionRepository.save(
      this.sessionRepository.create(dto),
    );
    return await this.findById(saved.id);
  }

  async update(id: string, dto: UpdateScreeningSessionDto): Promise<ScreeningSession> {
    const session = await this.sessionRepository.findOneBy({ id });
    if (!session) {
      throw new NotFoundException(`Sesi screening dengan id ${id} tidak ditemukan`);
    }
    if (session.status !== ScreeningStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Sesi yang sudah selesai atau gagal tidak dapat diubah lagi',
      );
    }

    const newStatus = dto.status ?? session.status;
    const closing = newStatus !== ScreeningStatus.IN_PROGRESS;

    if (dto.completedAt && !closing) {
      throw new BadRequestException(
        'Waktu selesai hanya boleh diisi saat status completed atau failed',
      );
    }

    // sesi baru boleh diselesaikan jika sudah punya minimal satu hasil
    if (newStatus === ScreeningStatus.COMPLETED) {
      const resultCount = await this.resultRepository.countBy({ sessionId: id });
      if (resultCount === 0) {
        throw new BadRequestException(
          'Sesi belum bisa diselesaikan karena belum memiliki hasil screening',
        );
      }
    }

    if (dto.chiefComplaint !== undefined) {
      session.chiefComplaint = dto.chiefComplaint;
    }
    session.status = newStatus;
    if (closing) {
      session.completedAt = dto.completedAt ?? new Date();
    }

    await this.sessionRepository.save(session);
    return await this.findById(id);
  }

  // Tabel sesi tidak punya deleted_at. Jawaban, chat, scan, dan hasil ikut terhapus (CASCADE)
  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    const session = await this.sessionRepository.findOneBy({ id });
    if (!session) {
      throw new NotFoundException(`Sesi screening dengan id ${id} tidak ditemukan`);
    }

    await this.sessionRepository.delete(id);

    return {
      message: `Sesi screening dengan id ${id} beserta seluruh datanya berhasil dihapus`,
      deletedId: id,
    };
  }
}