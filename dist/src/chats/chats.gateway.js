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
exports.ChatsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const websockets_2 = require("@nestjs/websockets");
const jwt_1 = require("@nestjs/jwt");
const socket_io_1 = require("socket.io");
const chats_service_1 = require("./chats.service");
let ChatsGateway = class ChatsGateway {
    chatsService;
    jwtService;
    server;
    constructor(chatsService, jwtService) {
        this.chatsService = chatsService;
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const payload = await this.jwtService.verifyAsync(this.socketToken(client));
            const user = {
                userId: payload.sub,
                correo: payload.correo,
                rol_id: payload.rol_id,
            };
            client.data.user = user;
            await client.join(this.userRoom(user.userId));
        }
        catch {
            client.disconnect();
        }
    }
    async joinRoom(client, payload) {
        const user = this.currentUser(client);
        const requestId = this.requestId(payload.roomId);
        if (requestId !== null) {
            await this.chatsService.authorizeConversation(requestId, user.userId, user.rol_id);
        }
        await client.join(payload.roomId);
        return {
            event: 'joinedRoom',
            data: payload,
        };
    }
    async sendMessage(client, payload) {
        const user = this.currentUser(client);
        const requestId = this.requestId(payload.roomId);
        const message = requestId === null
            ? await this.chatsService.create(payload, user.userId)
            : await this.chatsService.sendConversationMessage(requestId, payload.message, user.userId, user.rol_id);
        this.server.to(payload.roomId).emit('newMessage', message);
        return message;
    }
    emitUserEvent(userId, event, data) {
        this.server.to(this.userRoom(userId)).emit(event, data);
    }
    currentUser(client) {
        const user = client.data.user;
        if (!user) {
            throw new websockets_2.WsException('Usuario no autenticado');
        }
        return user;
    }
    socketToken(client) {
        const authToken = client.handshake.auth?.token;
        const authorization = client.handshake.headers.authorization;
        const bearer = typeof authorization === 'string' && authorization.startsWith('Bearer ')
            ? authorization.slice(7)
            : undefined;
        const token = authToken ?? bearer;
        if (!token) {
            throw new websockets_2.WsException('Token requerido');
        }
        return token;
    }
    requestId(roomId) {
        const match = /^request-(\d+)$/.exec(roomId);
        return match ? Number(match[1]) : null;
    }
    userRoom(userId) {
        return `user-${userId}`;
    }
};
exports.ChatsGateway = ChatsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "sendMessage", null);
exports.ChatsGateway = ChatsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'chat',
    }),
    __metadata("design:paramtypes", [chats_service_1.ChatsService,
        jwt_1.JwtService])
], ChatsGateway);
//# sourceMappingURL=chats.gateway.js.map