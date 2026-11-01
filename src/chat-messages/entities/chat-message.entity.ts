import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScreeningSession } from '../../screening-sessions/entities/screening-session.entity';
import { ChatSender } from '../../common/enums/chat-sender.enum';

@Entity({ name: 'chat_messages' })
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => ScreeningSession, (session) => session.chatMessages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: ScreeningSession;

  @Column({ type: 'enum', enum: ChatSender })
  sender: ChatSender;

  @Column({ name: 'message_text', type: 'text' })
  messageText: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}