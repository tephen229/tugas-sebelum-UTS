import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScreeningAnswer } from './entities/screening-answer.entity';
import { CreateScreeningAnswerDto } from './dto/create-screening-answer.dto';
import { UpdateScreeningAnswerDto } from './dto/update-screening-answer.dto';
import { ScreeningSessionsService } from '../screening-sessions/screening-sessions.service';
import { QuestionnaireQuestionsService } from '../questionnaire-questions/questionnaire-questions.service';
import { QuestionnaireQuestion } from '../questionnaire-questions/entities/questionnaire-question.entity';
import { ScreeningMethod } from '../common/enums/screening-method.enum';
import { isPgError, PG_UNIQUE_VIOLATION } from '../common/utils/pg-error.util';

@Injectable()
export class ScreeningAnswersService {
  constructor(
    @InjectRepository(ScreeningAnswer)
    private readonly answerRepository: Repository<ScreeningAnswer>,
    private readonly sessionsService: ScreeningSessionsService,
    private readonly questionsService: QuestionnaireQuestionsService,
  ) {}

  // GET /screening-answers?sessionId=...
  async findAll(sessionId?: string): Promise<ScreeningAnswer[]> {
    return await this.answerRepository.find({
      where: sessionId ? { sessionId } : {},
      relations: { question: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<ScreeningAnswer> {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: { question: true },
    });
    if (!answer) {
      throw new NotFoundException(`Jawaban dengan id ${id} tidak ditemukan`);
    }
    return answer;
  }

  async create(dto: CreateScreeningAnswerDto): Promise<ScreeningAnswer> {
    await this.sessionsService.findOpenSession(dto.sessionId, ScreeningMethod.QUESTIONNAIRE);

    const question = await this.questionsService.findById(dto.questionId);
    if (!question.isActive) {
      throw new BadRequestException('Pertanyaan ini sudah tidak aktif');
    }
    this.validateAnswerValue(question, dto.answerValue);

    try {
      const saved = await this.answerRepository.save(
        this.answerRepository.create({
          sessionId: dto.sessionId,
          questionId: dto.questionId,
          answerValue: dto.answerValue,
        }),
      );
      return await this.findById(saved.id);
    } catch (error) {
      if (isPgError(error, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('Pertanyaan ini sudah dijawab pada sesi tersebut');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateScreeningAnswerDto): Promise<ScreeningAnswer> {
    const answer = await this.findById(id);
    await this.sessionsService.findOpenSession(answer.sessionId, ScreeningMethod.QUESTIONNAIRE);

    this.validateAnswerValue(answer.question, dto.answerValue);

    answer.answerValue = dto.answerValue;
    await this.answerRepository.save(answer);
    return await this.findById(id);
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    const answer = await this.findById(id);
    await this.sessionsService.findOpenSession(answer.sessionId, ScreeningMethod.QUESTIONNAIRE);

    await this.answerRepository.delete(id);

    return {
      message: `Jawaban dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }

  // Nilai jawaban (JSONB) harus cocok dengan tipe dan pilihan pada pertanyaannya
  private validateAnswerValue(question: QuestionnaireQuestion, value: unknown): void {
    const options = question.options ?? [];

    switch (question.answerType) {
      case 'single_choice':
        if (typeof value !== 'string' || !options.includes(value)) {
          throw new BadRequestException(
            `Jawaban harus salah satu dari: ${options.join(', ')}`,
          );
        }
        break;

      case 'multiple_choice':
        if (
          !Array.isArray(value) ||
          value.length === 0 ||
          !value.every((v) => typeof v === 'string' && options.includes(v)) ||
          new Set(value).size !== value.length
        ) {
          throw new BadRequestException(
            `Jawaban harus berupa daftar minimal satu pilihan, tanpa duplikat, dari: ${options.join(', ')}`,
          );
        }
        break;

      case 'text':
        if (typeof value !== 'string' || value.trim() === '' || value.length > 2000) {
          throw new BadRequestException(
            'Jawaban teks tidak boleh kosong dan maksimal 2000 karakter',
          );
        }
        break;

      case 'number':
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          throw new BadRequestException('Jawaban harus berupa angka');
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new BadRequestException('Jawaban harus berupa true atau false');
        }
        break;

      default:
        throw new BadRequestException(
          `Tipe jawaban ${question.answerType} pada pertanyaan ini tidak dikenali`,
        );
    }
  }
}