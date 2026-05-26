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
exports.ProviderReviewSummaryController = exports.ProviderPublicReviewsController = exports.RequestReviewsController = exports.CalificacionesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const calificaciones_service_1 = require("./calificaciones.service");
const create_calificacion_dto_1 = require("./dto/create-calificacion.dto");
const update_calificacion_dto_1 = require("./dto/update-calificacion.dto");
const create_review_dto_1 = require("./dto/create-review.dto");
let CalificacionesController = class CalificacionesController {
    calificacionesService;
    constructor(calificacionesService) {
        this.calificacionesService = calificacionesService;
    }
    create(data, user) {
        return this.calificacionesService.create(data, user.userId, user.rol_id);
    }
    findAll(user) {
        return this.calificacionesService.findAll(user.userId, user.rol_id);
    }
    findOne(id, user) {
        return this.calificacionesService.findOne(id, user.userId, user.rol_id);
    }
    update(id, data, user) {
        return this.calificacionesService.update(id, data, user.userId, user.rol_id);
    }
    remove(id, user) {
        return this.calificacionesService.remove(id, user.userId, user.rol_id);
    }
};
exports.CalificacionesController = CalificacionesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cliente'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_calificacion_dto_1.CreateCalificacionDto, Object]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_calificacion_dto_1.UpdateCalificacionDto, Object]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "remove", null);
exports.CalificacionesController = CalificacionesController = __decorate([
    (0, common_1.Controller)('calificaciones'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [calificaciones_service_1.CalificacionesService])
], CalificacionesController);
let RequestReviewsController = class RequestReviewsController {
    calificacionesService;
    constructor(calificacionesService) {
        this.calificacionesService = calificacionesService;
    }
    create(id, data, user) {
        return this.calificacionesService.createReview(id, data, user.userId);
    }
};
exports.RequestReviewsController = RequestReviewsController;
__decorate([
    (0, common_1.Post)(':id/review'),
    (0, roles_decorator_1.Roles)('cliente'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_review_dto_1.CreateReviewDto, Object]),
    __metadata("design:returntype", void 0)
], RequestReviewsController.prototype, "create", null);
exports.RequestReviewsController = RequestReviewsController = __decorate([
    (0, common_1.Controller)('requests'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [calificaciones_service_1.CalificacionesService])
], RequestReviewsController);
let ProviderPublicReviewsController = class ProviderPublicReviewsController {
    calificacionesService;
    constructor(calificacionesService) {
        this.calificacionesService = calificacionesService;
    }
    findReviews(id) {
        return this.calificacionesService.providerReviews(id);
    }
};
exports.ProviderPublicReviewsController = ProviderPublicReviewsController;
__decorate([
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProviderPublicReviewsController.prototype, "findReviews", null);
exports.ProviderPublicReviewsController = ProviderPublicReviewsController = __decorate([
    (0, common_1.Controller)('providers'),
    __metadata("design:paramtypes", [calificaciones_service_1.CalificacionesService])
], ProviderPublicReviewsController);
let ProviderReviewSummaryController = class ProviderReviewSummaryController {
    calificacionesService;
    constructor(calificacionesService) {
        this.calificacionesService = calificacionesService;
    }
    summary(user) {
        return this.calificacionesService.providerReviews(user.userId);
    }
};
exports.ProviderReviewSummaryController = ProviderReviewSummaryController;
__decorate([
    (0, common_1.Get)('reviews/summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProviderReviewSummaryController.prototype, "summary", null);
exports.ProviderReviewSummaryController = ProviderReviewSummaryController = __decorate([
    (0, common_1.Controller)('provider'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('prestador'),
    __metadata("design:paramtypes", [calificaciones_service_1.CalificacionesService])
], ProviderReviewSummaryController);
//# sourceMappingURL=calificaciones.controller.js.map