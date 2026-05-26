import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema({ timestamps: true })
export class ChatMessage {
  createdAt!: Date;

  updatedAt!: Date;

  @Prop({ required: true })
  roomId!: string;

  @Prop({ required: true })
  senderId!: number;

  @Prop()
  receiverId?: number;

  @Prop({ required: true })
  message!: string;

  @Prop({ default: false })
  read!: boolean;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
