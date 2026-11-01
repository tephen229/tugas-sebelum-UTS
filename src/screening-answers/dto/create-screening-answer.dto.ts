import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateScreeningAnswerDto {
  @IsNotEmpty({ message: 'Session ID tidak boleh kosong' })
  @IsUUID('4', { message: 'Session ID harus berupa UUID yang valid' })
  readonly sessionId: string;

  @IsNotEmpty({ message: 'Question ID tidak boleh kosong' })
  @IsUUID('4', { message: 'Question ID harus berupa UUID yang valid' })
  readonly questionId: string;

  // JSONB: bisa string, angka, boolean, array, atau objek.
  // Kecocokan dengan answer_type pertanyaan dicek di service.
  @IsDefined({ message: 'Nilai jawaban tidak boleh kosong' })
  readonly answerValue: unknown;
}