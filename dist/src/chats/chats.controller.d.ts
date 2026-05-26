import type { AuthUser } from '../auth/types/auth-user.type';
import { ChatsService } from './chats.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { SendConversationMessageDto } from './dto/send-conversation-message.dto';
export declare class ChatsController {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    create(data: CreateChatMessageDto, user: AuthUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat-message.schema").ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/chat-message.schema").ChatMessage & {
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
    findAll(user: AuthUser): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat-message.schema").ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/chat-message.schema").ChatMessage & {
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
    }>)[]>;
    findByRoom(roomId: string, user: AuthUser): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat-message.schema").ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/chat-message.schema").ChatMessage & {
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
    }>)[]>;
    findOne(id: string, user: AuthUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat-message.schema").ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/chat-message.schema").ChatMessage & {
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
    update(id: string, data: UpdateChatMessageDto, user: AuthUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat-message.schema").ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/chat-message.schema").ChatMessage & {
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
    remove(id: string, user: AuthUser): Promise<{
        message: string;
    }>;
}
export declare class ConversationsController {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    findAll(user: AuthUser): Promise<{
        data: {
            id: number;
            requestId: number;
            otherUser: {
                id: number;
                nombre: string;
                oficio: {} | undefined;
            };
            lastMessage: string | null;
            lastMessageAt: Date | null;
            unreadCount: number;
        }[];
    }>;
    findMessages(id: number, user: AuthUser): Promise<{
        data: {
            id: string;
            conversationId: number;
            senderId: number;
            text: string;
            sentAt: Date;
            readAt: Date | null;
        }[];
    }>;
    sendMessage(id: number, data: SendConversationMessageDto, user: AuthUser): Promise<{
        id: string;
        conversationId: number;
        senderId: number;
        text: string;
        sentAt: Date;
        readAt: Date | null;
    }>;
    read(id: number, user: AuthUser): Promise<{
        id: number;
        unreadCount: number;
    }>;
}
