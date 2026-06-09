import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Socket connected:', client.id);
  }

  @SubscribeMessage('joinUserRoom')
  joinUserRoom(
    @MessageBody()
    data: {
      userId: string;
      role: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `${data.role}-${data.userId}`;
    client.join(room);

    console.log(`Socket ${client.id} joined ${room}`);

    return {
      message: `Joined ${room}`,
    };
  }

  sendNotification(data: {
    userId: string;
    role: string;
    notification: any;
  }) {
    const room = `${data.role}-${data.userId}`;

    this.server.to(room).emit('newNotification', data.notification);
  }
}