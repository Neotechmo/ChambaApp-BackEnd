import { HydratedDocument } from 'mongoose';
export type LogDocument = HydratedDocument<Log>;
export declare class Log {
    userId?: number;
    action: string;
    entity?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
}
export declare const LogSchema: import("mongoose").Schema<Log, import("mongoose").Model<Log, any, any, any, any, any, Log>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Log, import("mongoose").Document<unknown, {}, Log, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<number | undefined, Log, import("mongoose").Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    action?: import("mongoose").SchemaDefinitionProperty<string, Log, import("mongoose").Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    entity?: import("mongoose").SchemaDefinitionProperty<string | undefined, Log, import("mongoose").Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    entityId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Log, import("mongoose").Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown> | undefined, Log, import("mongoose").Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Log>;
