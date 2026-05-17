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
let ChatsService = class ChatsService {
    chatMessageModel;
    constructor(chatMessageModel) {
        this.chatMessageModel = chatMessageModel;
    }
    async create(data, userId) {
        return this.chatMessageModel.create({
            roomId: data.roomId,
            senderId: data.senderId ?? userId,
            receiverId: data.receiverId,
            message: data.message,
        });
    }
    async findAll(userId, rolId) {
        const filter = rolId === 1
            ? {}
            : { $or: [{ senderId: userId }, { receiverId: userId }] };
        return this.chatMessageModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async findByRoom(roomId, userId, rolId) {
        const filter = rolId === 1
            ? { roomId }
            : {
                roomId,
                $or: [{ senderId: userId }, { receiverId: userId }],
            };
        return this.chatMessageModel.find(filter).sort({ createdAt: 1 }).exec();
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
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_message_schema_1.ChatMessage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatsService);
//# sourceMappingURL=chats.service.js.map