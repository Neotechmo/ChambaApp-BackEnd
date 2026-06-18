"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_message_schema_1 = require("./schemas/chat-message.schema");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatsService = class ChatsService {
    chatMessageModel;
    prisma;
    constructor(chatMessageModel, prisma) {
        this.chatMessageModel = chatMessageModel;
        this.prisma = prisma;
    }
    async create(data, userId, rolId) {
        const requestId = this.requestIdFromRoom(data.roomId);
        if (requestId === null) {
            throw new common_1.ForbiddenException('Sala de chat no autorizada');
        }
        const request = await this.authorizeConversation(requestId, userId, rolId);
        const receiverId = request.cliente_id === userId
            ? request.servicio.prestador_id
            : request.cliente_id;
        return this.chatMessageModel.create({
            roomId: data.roomId,
            senderId: userId,
            receiverId,
            message: data.message,
        });
    }
    async findConversations(userId, rolId) {
        const requests = await this.prisma.solicitud.findMany({
            where: rolId === 1
                ? {}
                : {
                    OR: [
                        { cliente_id: userId },
                        { servicio: { prestador_id: userId } },
                    ],
                },
            include: {
                cliente: { select: { id: true, nombre: true, apellido: true } },
                servicio: {
                    include: {
                        prestador: {
                            select: {
                                id: true,
                                nombre: true,
                                apellido: true,
                                especialidad: true,
                            },
                        },
                    },
                },
            },
        });
        const data = await Promise.all(requests.map(async (request) => {
            const roomId = this.roomId(request.id);
            const [lastMessage, unreadCount] = await Promise.all([
                this.chatMessageModel
                    .findOne({ roomId })
                    .sort({ createdAt: -1 })
                    .exec(),
                this.chatMessageModel.countDocuments({
                    roomId,
                    receiverId: userId,
                    read: false,
                }),
            ]);
            const other = request.cliente_id === userId
                ? request.servicio.prestador
                : request.cliente;
            return {
                id: request.id,
                requestId: request.id,
                otherUser: {
                    id: other.id,
                    nombre: [other.nombre, other.apellido].filter(Boolean).join(' '),
                    oficio: 'especialidad' in other
                        ? (other.especialidad ?? undefined)
                        : undefined,
                },
                lastMessage: lastMessage?.message ?? null,
                lastMessageAt: lastMessage?.createdAt ?? null,
                unreadCount,
            };
        }));
        return { data };
    }
    async findConversationMessages(id, userId, rolId) {
        await this.authorizeConversation(id, userId, rolId);
        const messages = await this.chatMessageModel
            .find({ roomId: this.roomId(id) })
            .sort({ createdAt: 1 })
            .exec();
        return { data: messages.map((message) => this.mapMessage(id, message)) };
    }
    async sendConversationMessage(id, text, userId, rolId) {
        const request = await this.authorizeConversation(id, userId, rolId);
        const receiverId = request.cliente_id === userId
            ? request.servicio.prestador_id
            : request.cliente_id;
        const message = await this.chatMessageModel.create({
            roomId: this.roomId(id),
            senderId: userId,
            receiverId,
            message: text,
        });
        return this.mapMessage(id, message);
    }
    async markConversationRead(id, userId, rolId) {
        await this.authorizeConversation(id, userId, rolId);
        await this.chatMessageModel.updateMany({ roomId: this.roomId(id), receiverId: userId, read: false }, { read: true });
        return { id, unreadCount: 0 };
    }
    async findAll(userId, rolId) {
        const filter = rolId === 1
            ? {}
            : { $or: [{ senderId: userId }, { receiverId: userId }] };
        return this.chatMessageModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async findByRoom(roomId, userId, rolId) {
        const requestId = this.requestIdFromRoom(roomId);
        if (requestId === null) {
            throw new common_1.ForbiddenException('Sala de chat no autorizada');
        }
        await this.authorizeConversation(requestId, userId, rolId);
        return this.chatMessageModel.find({ roomId }).sort({ createdAt: 1 }).exec();
    }
    async findOne(id, userId, rolId) {
        const message = await this.chatMessageModel.findById(id).exec();
        if (!message) {
            throw new common_1.NotFoundException('Mensaje no encontrado');
        }
        if (rolId !== 1 &&
            message.senderId !== userId &&
            message.receiverId !== userId) {
            throw new common_1.ForbiddenException('No puedes ver este mensaje');
        }
        return message;
    }
    async update(id, data, userId, rolId) {
        const message = await this.findOne(id, userId, rolId);
        if (rolId !== 1 && message.senderId !== userId) {
            throw new common_1.ForbiddenException('No puedes editar este mensaje');
        }
        const updatedMessage = await this.chatMessageModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
        if (!updatedMessage) {
            throw new common_1.NotFoundException('Mensaje no encontrado');
        }
        return updatedMessage;
    }
    async remove(id, userId, rolId) {
        const message = await this.findOne(id, userId, rolId);
        if (rolId !== 1 && message.senderId !== userId) {
            throw new common_1.ForbiddenException('No puedes eliminar este mensaje');
        }
        await this.chatMessageModel.findByIdAndDelete(id).exec();
        return {
            message: 'Mensaje eliminado correctamente',
        };
    }
    async authorizeConversation(id, userId, rolId) {
        const request = await this.prisma.solicitud.findUnique({
            where: { id },
            include: { servicio: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Conversacion no encontrada');
        }
        if (rolId !== 1 &&
            request.cliente_id !== userId &&
            request.servicio.prestador_id !== userId) {
            throw new common_1.ForbiddenException('No puedes ver esta conversacion');
        }
        return request;
    }
    roomId(id) {
        return `request-${id}`;
    }
    requestIdFromRoom(roomId) {
        const match = /^request-(\d+)$/.exec(roomId);
        return match ? Number(match[1]) : null;
    }
    mapMessage(conversationId, message) {
        return {
            id: message.id,
            conversationId,
            senderId: message.senderId,
            text: message.message,
            sentAt: message.createdAt,
            readAt: message.read ? message.updatedAt : null,
        };
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_message_schema_1.ChatMessage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        prisma_service_1.PrismaService])
], ChatsService);
//# sourceMappingURL=chats.service.js.map