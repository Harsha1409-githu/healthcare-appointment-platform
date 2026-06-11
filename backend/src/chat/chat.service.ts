import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ChatMessage,
  ChatSenderRole,
} from './chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatRepo: Repository<ChatMessage>,
  ) {}

  async createMessage(data: {
    appointmentId: number;
    senderId: string;
    senderRole: ChatSenderRole;
    message: string;
  }) {
    const chat = this.chatRepo.create(data);
    return this.chatRepo.save(chat);
  }

  async getMessages(appointmentId: number) {
    return this.chatRepo.find({
      where: { appointmentId },
      order: { createdAt: 'ASC' },
    });
  }
}