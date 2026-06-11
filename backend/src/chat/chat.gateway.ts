import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatSenderRole } from './chat-message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinChatRoom')
  joinChatRoom(
    @MessageBody() data: { appointmentId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`appointment-${data.appointmentId}`);

    return {
      message: 'Joined chat room',
      room: `appointment-${data.appointmentId}`,
    };
  }

  @SubscribeMessage('typing')
typing(
  @MessageBody()
  data: {
    appointmentId: number;
    senderName: string;
  },
) {
  this.server
    .to(`appointment-${data.appointmentId}`)
    .emit('userTyping', data);
}

  @SubscribeMessage('sendChatMessage')
  async sendChatMessage(
    @MessageBody()
    data: {
      appointmentId: number;
      senderId: string;
      senderRole: ChatSenderRole;
      message: string;
    },
  ) {
    const savedMessage =
      await this.chatService.createMessage(data);

    this.server
      .to(`appointment-${data.appointmentId}`)
      .emit('newChatMessage', savedMessage);

    return savedMessage;
  }
}