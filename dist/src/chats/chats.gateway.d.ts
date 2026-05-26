import { OnGatewayConnection } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import type { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatsService } from './chats.service';
import type { AuthUser } from '../auth/types/auth-user.type';
type JoinRoomPayload = {
    roomId: string;
};
type UserSocket = Socket<Record<string, never>, Record<string, never>, Record<string, never>, {
    user?: AuthUser;
}>;
export declare class ChatsGateway implements OnGatewayConnection {
    private readonly chatsService;
    private readonly jwtService;
    server: Server;
    constructor(chatsService: ChatsService, jwtService: JwtService);
    handleConnection(client: UserSocket): Promise<void>;
    joinRoom(client: UserSocket, payload: JoinRoomPayload): Promise<{
        event: string;
        data: JoinRoomPayload;
    }>;
    sendMessage(client: UserSocket, payload: CreateChatMessageDto): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat-message.schema").ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/chat-message.schema").ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/chat-message.schema").ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/chat-message.schema").ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | {
        id: string;
        conversationId: number;
        senderId: number;
        text: string;
        sentAt: Date;
        readAt: Date | null;
    }>;
    emitUserEvent(userId: number, event: string, data: unknown): void;
    private currentUser;
    private socketToken;
    private requestId;
    private userRoom;
}
export {};
