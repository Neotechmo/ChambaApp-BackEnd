import { HydratedDocument } from 'mongoose';
export type ChatMessageDocument = HydratedDocument<ChatMessage>;
export declare class ChatMessage {
    createdAt: Date;
    updatedAt: Date;
    roomId: string;
    senderId: number;
    receiverId?: number;
    message: string;
    read: boolean;
}
export declare const ChatMessageSchema: import("mongoose").Schema<ChatMessage, import("mongoose").Model<ChatMessage, any, any, any, any, any, ChatMessage>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatMessage, import("mongoose").Document<unknown, {}, ChatMessage, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ChatMessage & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, ChatMessage, import("mongoose").Document<unknown, {}, ChatMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, ChatMessage, import("mongoose").Document<unknown, {}, ChatMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    roomId?: import("mongoose").SchemaDefinitionProperty<string, ChatMessage, import("mongoose").Document<unknown, {}, ChatMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    senderId?: import("mongoose").SchemaDefinitionProperty<number, ChatMessage, import("mongoose").Document<unknown, {}, ChatMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    receiverId?: import("mongoose").SchemaDefinitionProperty<number | undefined, ChatMessage, import("mongoose").Document<unknown, {}, ChatMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, ChatMessage, import("mongoose").Document<unknown, {}, ChatMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    read?: import("mongoose").SchemaDefinitionProperty<boolean, ChatMessage, import("mongoose").Document<unknown, {}, ChatMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ChatMessage>;
