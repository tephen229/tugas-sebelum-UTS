import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QuestionnaireQuestion } from './entities/questionnaire-question.entity';
import { CreateQuestionnaireQuestionDto } from './dto/create-questionnaire-question.dto';
import { UpdateQuestionnaireQuestionDto } from './dto/update-questionnaire-question.dto';
import { FindQuestionnaireQuestionsDto } from './dto/find-questionnaire-questions.dto';
import { isPgError, PG_FOREIGN_KEY_VIOLATION } from '../common/utils/pg-error.util';

const CHOICE_TYPES = ['single_choice', 'multiple_choice'];

@Injectable()
export class QuestionnaireQuestionsService {
  constructor(
    @InjectRepository(QuestionnaireQuestion)
    private readonly questionRepository: Repository<QuestionnaireQuestion>,
  ) {}

  async findAll(
    filters: FindQuestionnaireQuestionsDto = {},
  ): Promise<QuestionnaireQuestion[]> {
    const where: FindOptionsWhere<QuestionnaireQuestion> = {};
    if (filters.category) where.category = filters.category;
    if (filters.activeOnly) where.isActive = true;

    return await this.questionRepository.find({
      where,
      order: { displayOrder: 'ASC', category: 'ASC' },
    });
  }

  async findById(id: string): Promise<QuestionnaireQuestion> {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException(`Pertanyaan dengan id ${id} tidak ditemukan`);
    }
    return question;
  }

  async create(dto: CreateQuestionnaireQuestionDto): Promise<QuestionnaireQuestion> {
    this.assertOptionsConsistent(dto.answerType, dto.options);

    const saved = await this.questionRepository.save(
      this.questionRepository.create(dto),
    );
    return await this.findById(saved.id);
  }

  async update(
    id: string,
    dto: UpdateQuestionnaireQuestionDto,
  ): Promise<QuestionnaireQuestion> {
    const question = await this.findById(id);

    // nilai akhir setelah update dipakai untuk memeriksa kecocokan tipe vs options
    const answerType = dto.answerType ?? question.answerType;
    const options = dto.options !== undefined ? dto.options : question.options;
    this.assertOptionsConsistent(answerType, options);

    this.questionRepository.merge(question, dto);
    question.options = options && options.length > 0 ? options : null;

    await this.questionRepository.save(question);
    return await this.findById(id);
  }

  // Tabel ini tidak punya deleted_at. Jika sudah pernah dijawab, gunakan isActive=false
  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    await this.findById(id);

    try {
      await this.questionRepository.delete(id);
    } catch (error) {
      if (isPgError(error, PG_FOREIGN_KEY_VIOLATION)) {
        throw new ConflictException(
          'Pertanyaan sudah pernah dijawab sehingga tidak bisa dihapus. Nonaktifkan dengan isActive=false',
        );
      }
      throw error;
    }

    return {
      message: `Pertanyaan dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }

  // Tipe pilihan wajib punya options. Tipe lain tidak boleh punya options.
  private assertOptionsConsistent(
    answerType: string,
    options?: string[] | null,
  ): void {
    const isChoice = CHOICE_TYPES.includes(answerType);
    const hasOptions = Array.isArray(options) && options.length > 0;

    if (isChoice && !hasOptions) {
      throw new BadRequestException(
        'Tipe jawaban pilihan (single_choice / multiple_choice) wajib memiliki options',
      );
    }
    if (!isChoice && hasOptions) {
      throw new BadRequestException(
        'Options hanya boleh diisi untuk tipe single_choice atau multiple_choice. ' +
          'Untuk mengosongkan options, kirim "options": null',
      );
    }
    if (hasOptions && new Set(options).size !== options.length) {
      throw new BadRequestException('Options tidak boleh berisi pilihan yang sama dua kali');
    }
  }
}