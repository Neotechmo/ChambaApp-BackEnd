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
exports.ProviderRequestsController = exports.RequestsController = exports.SolicitudesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const create_solicitud_dto_1 = require("./dto/create-solicitud.dto");
const create_request_dto_1 = require("./dto/create-request.dto");
const request_action_dto_1 = require("./dto/request-action.dto");
const reschedule_request_dto_1 = require("./dto/reschedule-request.dto");
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
        return this.solicitudesService.findRequest(id, user.userId, user.rol_id);
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
let RequestsController = class RequestsController {
    solicitudesService;
    constructor(solicitudesService) {
        this.solicitudesService = solicitudesService;
    }
    create(data, user) {
        return this.solicitudesService.createRequest(data, user.userId);
    }
    findMine(user) {
        return this.solicitudesService.findMine(user.userId);
    }
    findOne(id, user) {
        return this.solicitudesService.findRequest(id, user.userId, user.rol_id);
    }
    cancel(id, user) {
        return this.solicitudesService.cancelRequest(id, user.userId);
    }
    reschedule(id, data, user) {
        return this.solicitudesService.rescheduleRequest(id, user.userId, data);
    }
    acceptProposedDate(id, user) {
        return this.solicitudesService.acceptProposedDate(id, user.userId);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('cliente'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_request_dto_1.CreateRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, roles_decorator_1.Roles)('cliente'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_1.Roles)('cliente'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/reschedule'),
    (0, roles_decorator_1.Roles)('cliente'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reschedule_request_dto_1.RescheduleRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "reschedule", null);
__decorate([
    (0, common_1.Patch)(':id/accept-date'),
    (0, roles_decorator_1.Roles)('cliente'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "acceptProposedDate", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [solicitudes_service_1.SolicitudesService])
], RequestsController);
let ProviderRequestsController = class ProviderRequestsController {
    solicitudesService;
    constructor(solicitudesService) {
        this.solicitudesService = solicitudesService;
    }
    findRequests(user) {
        return this.solicitudesService.findProviderRequests(user.userId);
    }
    accept(id, user) {
        return this.solicitudesService.acceptRequest(id, user.userId);
    }
    reject(id, data, user) {
        return this.solicitudesService.rejectRequest(id, user.userId, data.motivo);
    }
    proposeDate(id, data, user) {
        return this.solicitudesService.proposeDate(id, user.userId, data.fechaPropuesta);
    }
    findJobs(user) {
        return this.solicitudesService.findProviderJobs(user.userId);
    }
    updateStatus(id, data, user) {
        return this.solicitudesService.updateJobStatus(id, user.userId, data.status);
    }
    getCalendar(user) {
        return this.solicitudesService.findProviderCalendar(user.userId);
    }
};
exports.ProviderRequestsController = ProviderRequestsController;
__decorate([
    (0, common_1.Get)('requests'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProviderRequestsController.prototype, "findRequests", null);
__decorate([
    (0, common_1.Patch)('requests/:id/accept'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ProviderRequestsController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)('requests/:id/reject'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, request_action_dto_1.RejectRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ProviderRequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)('requests/:id/propose-date'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reschedule_request_dto_1.ProposeDateDto, Object]),
    __metadata("design:returntype", void 0)
], ProviderRequestsController.prototype, "proposeDate", null);
__decorate([
    (0, common_1.Get)('jobs'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProviderRequestsController.prototype, "findJobs", null);
__decorate([
    (0, common_1.Patch)('jobs/:id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, request_action_dto_1.UpdateJobStatusDto, Object]),
    __metadata("design:returntype", void 0)
], ProviderRequestsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('calendar'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProviderRequestsController.prototype, "getCalendar", null);
exports.ProviderRequestsController = ProviderRequestsController = __decorate([
    (0, common_1.Controller)('provider'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('prestador'),
    __metadata("design:paramtypes", [solicitudes_service_1.SolicitudesService])
], ProviderRequestsController);
//# sourceMappingURL=solicitudes.controller.js.map