import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from './auth/auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages')
  getMessages(@Req() req: any) {
    return this.chatService.getMessages(req.user.id);
  }

  @Post('send')
  sendMessage(@Req() req: any, @Body() body: { text: string }) {
    return this.chatService.sendMessage(req.user.id, body.text);
  }
}
