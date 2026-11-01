import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateChatMessageDto } from './create-chat-message.dto';

// Riwayat percakapan tidak boleh diedit. Hanya metadata yang boleh dilengkapi.
export class UpdateChatMessageDto extends PartialType(
  PickType(CreateChatMessageDto, ['metadata'] as const),
) {}