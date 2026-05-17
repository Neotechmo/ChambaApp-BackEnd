"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const calificaciones_module_1 = require("./calificaciones/calificaciones.module");
const chats_module_1 = require("./chats/chats.module");
const logs_module_1 = require("./logs/logs.module");
const notifications_module_1 = require("./notifications/notifications.module");
const pagos_module_1 = require("./pagos/pagos.module");
const prisma_module_1 = require("./prisma/prisma.module");
const services_module_1 = require("./services/services.module");
const solicitudes_module_1 = require("./solicitudes/solicitudes.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI ??
                process.env.MONGO_URI ??
                'mongodb://127.0.0.1:27017/chambaapp'),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            prisma_module_1.PrismaModule,
            services_module_1.ServicesModule,
            solicitudes_module_1.SolicitudesModule,
            pagos_module_1.PagosModule,
            calificaciones_module_1.CalificacionesModule,
            notifications_module_1.NotificationsModule,
            chats_module_1.ChatsModule,
            logs_module_1.LogsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map