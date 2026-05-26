import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types/auth-user.type';
import { ChatsService } from './chats.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { SendConversationMessageDto } from './dto/send-conversation-message.dto';
import { ParseIntPipe } from '@nestjs/common';

@Controller('chats')
@UseGuards(AuthGuard('jwt'))
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Body() data: CreateChatMessageDto, @CurrentUser() user: AuthUser) {
    return this.chatsService.create(data, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.chatsService.findAll(user.userId, user.rol_id);
  }

  @Get('room/:roomId')
  findByRoom(@Param('roomId') roomId: string, @CurrentUser() user: AuthUser) {
    return this.chatsService.findByRoom(roomId, user.userId, user.rol_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.chatsService.findOne(id, user.userId, user.rol_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateChatMessageDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.chatsService.update(id, data, user.userId, user.rol_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.chatsService.remove(id, user.userId, user.rol_id);
  }
}

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.chatsService.findConversations(user.userId, user.rol_id);
  }

  @Get(':id/messages')
  findMessages(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.chatsService.findConversationMessages(
      id,
      user.userId,
      user.rol_id,
    );
  }

  @Post(':id/messages')
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: SendConversationMessageDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.chatsService.sendConversationMessage(
      id,
      data.text,
      user.userId,
      user.rol_id,
    );
  }

  @Patch(':id/read')
  read(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.chatsService.markConversationRead(id, user.userId, user.rol_id);
  }
}
