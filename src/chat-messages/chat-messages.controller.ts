import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private readonly messagesService: ChatMessagesService) {}

  @Get()
  findAll(@Query('sessionId', new ParseUUIDPipe({ optional: true })) sessionId?: string) {
    return this.messagesService.findAll(sessionId);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.messagesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateChatMessageDto) {
    return this.messagesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChatMessageDto,
  ) {
    return this.messagesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.messagesService.remove(id);
  }
}