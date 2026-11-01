import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessage } from './entities/chat-message.entity';
import { ScreeningSessionsModule } from '../screening-sessions/screening-sessions.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage]), ScreeningSessionsModule],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}