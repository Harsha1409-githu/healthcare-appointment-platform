import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':appointmentId')
  getMessages(@Param('appointmentId') appointmentId: string) {
    return this.chatService.getMessages(Number(appointmentId));
  }

  @Post()
  createMessage(@Body() body: any) {
    return this.chatService.createMessage({
      appointmentId: Number(body.appointmentId),
      senderId: body.senderId,
      senderRole: body.senderRole,
      message: body.message,
    });
  }
}