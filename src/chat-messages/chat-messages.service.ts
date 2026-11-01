import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { ScreeningSessionsService } from '../screening-sessions/screening-sessions.service';
import { ScreeningMethod } from '../common/enums/screening-method.enum';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
    private readonly sessionsService: ScreeningSessionsService,
  ) {}

  // GET /chat-messages?sessionId=... : urut dari pesan terlama (alur percakapan)
  async findAll(sessionId?: string): Promise<ChatMessage[]> {
    return await this.messageRepository.find({
      where: sessionId ? { sessionId } : {},
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<ChatMessage> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) {
      throw new NotFoundException(`Pesan dengan id ${id} tidak ditemukan`);
    }
    return message;
  }

  async create(dto: CreateChatMessageDto): Promise<ChatMessage> {
    await this.sessionsService.findOpenSession(dto.sessionId, ScreeningMethod.CHAT);

    return await this.messageRepository.save(this.messageRepository.create(dto));
  }

  // Hanya metadata yang boleh diubah (lihat UpdateChatMessageDto)
  async update(id: string, dto: UpdateChatMessageDto): Promise<ChatMessage> {
    const message = await this.findById(id);
    await this.sessionsService.findOpenSession(message.sessionId, ScreeningMethod.CHAT);

    this.messageRepository.merge(message, dto);
    return await this.messageRepository.save(message);
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    const message = await this.findById(id);
    await this.sessionsService.findOpenSession(message.sessionId, ScreeningMethod.CHAT);

    await this.messageRepository.delete(id);

    return {
      message: `Pesan dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }
}