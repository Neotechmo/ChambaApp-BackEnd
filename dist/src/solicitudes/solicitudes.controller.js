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
exports.SolicitudesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const create_solicitud_dto_1 = require("./dto/create-solicitud.dto");
const update_solicitud_dto_1 = require("./dto/update-solicitud.dto");
const solicitudes_service_1 = require("./solicitudes.service");
let SolicitudesController = class SolicitudesController {
    solicitudesService;
    constructor(solicitudesService) {
        this.solicitudesService = solicitudesService;
    }
    create(data, user) {
        return this.solicitudesService.create(data, user.userId);
    }
    findAll(user) {
        return this.solicitudesService.findAll(user.userId, user.rol_id);
    }
    findOne(id, user) {
        return this.solicitudesService.findOne(id, user.userId, user.rol_id);
    }
    update(id, data, user) {
        return this.solicitudesService.update(id, data, user.userId, user.rol_id);
    }
    remove(id, user) {
        return this.solicitudesService.remove(id, user.userId, user.rol_id);
    }
};
exports.SolicitudesController = SolicitudesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cliente'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_solicitud_dto_1.CreateSolicitudDto, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_solicitud_dto_1.UpdateSolicitudDto, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "remove", null);
exports.SolicitudesController = SolicitudesController = __decorate([
    (0, common_1.Controller)('solicitudes'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [solicitudes_service_1.SolicitudesService])
], SolicitudesController);
//# sourceMappingURL=solicitudes.controller.js.map