import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ChatSender } from '../../common/enums/chat-sender.enum';

export class CreateChatMessageDto {
  @IsNotEmpty({ message: 'Session ID tidak boleh kosong' })
  @IsUUID('4', { message: 'Session ID harus berupa UUID yang valid' })
  readonly sessionId: string;

  @IsNotEmpty({ message: 'Pengirim tidak boleh kosong' })
  @IsEnum(ChatSender, { message: 'Pengirim harus user atau assistant' })
  readonly sender: ChatSender;

  @IsNotEmpty({ message: 'Isi pesan tidak boleh kosong' })
  @IsString({ message: 'Isi pesan harus berupa string' })
  @MaxLength(5000, { message: 'Isi pesan maksimal 5000 karakter' })
  readonly messageText: string;

  @IsOptional()
  @IsObject({ message: 'Metadata harus berupa objek JSON' })
  readonly metadata?: Record<string, unknown>;
}