import { Model } from 'mongoose';
import type { CreateChatMessageDto } from './dto/create-chat-message.dto';
import type { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { ChatMessage, type ChatMessageDocument } from './schemas/chat-message.schema';
export declare class ChatsService {
    private readonly chatMessageModel;
    constructor(chatMessageModel: Model<ChatMessageDocument>);
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
}
