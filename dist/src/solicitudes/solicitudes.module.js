"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudesModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_module_1 = require("../notifications/notifications.module");
const chats_module_1 = require("../chats/chats.module");
const solicitudes_controller_1 = require("./solicitudes.controller");
const solicitudes_service_1 = require("./solicitudes.service");
let SolicitudesModule = class SolicitudesModule {
};
exports.SolicitudesModule = SolicitudesModule;
exports.SolicitudesModule = SolicitudesModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule, chats_module_1.ChatsModule],
        controllers: [
            solicitudes_controller_1.SolicitudesController,
            solicitudes_controller_1.RequestsController,
            solicitudes_controller_1.ProviderRequestsController,
        ],
        providers: [solicitudes_service_1.SolicitudesService],
        exports: [solicitudes_service_1.SolicitudesService],
    })
], SolicitudesModule);
//# sourceMappingURL=solicitudes.module.js.map