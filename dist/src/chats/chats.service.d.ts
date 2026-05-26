import { Model } from 'mongoose';
import type { CreateChatMessageDto } from './dto/create-chat-message.dto';
import type { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { ChatMessage, type ChatMessageDocument } from './schemas/chat-message.schema';
import { PrismaService } from '../prisma/prisma.service';
export declare class ChatsService {
    private readonly chatMessageModel;
    private readonly prisma;
    constructor(chatMessageModel: Model<ChatMessageDocument>, prisma: PrismaService);
    create(data: CreateChatMessageDto, userId: number): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findConversations(userId: number, rolId: number): Promise<{
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
    findConversationMessages(id: number, userId: number, rolId: number): Promise<{
        data: {
            id: string;
            conversationId: number;
            senderId: number;
            text: string;
            sentAt: Date;
            readAt: Date | null;
        }[];
    }>;
    sendConversationMessage(id: number, text: string, userId: number, rolId: number): Promise<{
        id: string;
        conversationId: number;
        senderId: number;
        text: string;
        sentAt: Date;
        readAt: Date | null;
    }>;
    markConversationRead(id: number, userId: number, rolId: number): Promise<{
        id: number;
        unreadCount: number;
    }>;
    findAll(userId: number, rolId: number): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findByRoom(roomId: string, userId: number, rolId: number): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string, userId: number, rolId: number): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, data: UpdateChatMessageDto, userId: number, rolId: number): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ChatMessage, {}, import("mongoose").DefaultSchemaOptions> & ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string, userId: number, rolId: number): Promise<{
        message: string;
    }>;
    authorizeConversation(id: number, userId: number, rolId: number): Promise<{
        servicio: {
            id: number;
            disponible: boolean;
            titulo: string;
            descripcion: string;
            precio_base: number;
            fecha_creacion: Date;
            prestador_id: number;
            categoria_id: number | null;
        };
    } & {
        id: number;
        estado: string;
        titulo: string | null;
        descripcion: string | null;
        direccion_servicio: string | null;
        prioridad: string;
        fecha_solicitud: Date;
        fecha_programada: Date | null;
        fecha_propuesta: Date | null;
        propuesta_pendiente: boolean;
        duracion_estimada_min: number | null;
        precio_estimado: number | null;
        precio_final: number | null;
        cliente_id: number;
        servicio_id: number;
        direccion_id: number | null;
    }>;
    private roomId;
    private mapMessage;
}
