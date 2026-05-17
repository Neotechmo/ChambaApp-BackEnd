import { Server, Socket } from 'socket.io';
import type { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatsService } from './chats.service';
type JoinRoomPayload = {
    roomId: string;
};
export declare class ChatsGateway {
    private readonly chatsService;
    server: Server;
    constructor(chatsService: ChatsService);
    joinRoom(client: Socket, payload: JoinRoomPayload): Promise<{
        event: string;
        data: JoinRoomPayload;
    }>;
    sendMessage(payload: CreateChatMessageDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat-message.schema").ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/chat-message.schema").ChatMessage & {
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
    }>>;
}
export {};
