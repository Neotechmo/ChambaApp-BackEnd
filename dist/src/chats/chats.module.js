"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const chats_controller_1 = require("./chats.controller");
const chats_gateway_1 = require("./chats.gateway");
const chats_service_1 = require("./chats.service");
const chat_message_schema_1 = require("./schemas/chat-message.schema");
let ChatsModule = class ChatsModule {
};
exports.ChatsModule = ChatsModule;
exports.ChatsModule = ChatsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET }),
            mongoose_1.MongooseModule.forFeature([
                { name: chat_message_schema_1.ChatMessage.name, schema: chat_message_schema_1.ChatMessageSchema },
            ]),
        ],
        controllers: [chats_controller_1.ChatsController, chats_controller_1.ConversationsController],
        providers: [chats_service_1.ChatsService, chats_gateway_1.ChatsGateway],
        exports: [chats_service_1.ChatsService, chats_gateway_1.ChatsGateway],
    })
], ChatsModule);
//# sourceMappingURL=chats.module.js.map