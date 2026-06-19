"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerModule = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston = __importStar(require("winston"));
const SanitizeTransform = winston.format((info) => {
    const SENSITIVE_KEYS = ['password', 'password_hash', 'token', 'access_token',
        'refresh_token', 'authorization', 'secret', 'pin', 'cvv', 'card'];
    const sanitize = (obj) => {
        if (!obj || typeof obj !== 'object')
            return obj;
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))
                ? '[REDACTED]'
                : sanitize(value);
        }
        return sanitized;
    };
    if (info.meta)
        info.meta = sanitize(info.meta);
    if (info.body)
        info.body = sanitize(info.body);
    return info;
})();
const jsonFormat = winston.format.combine(SanitizeTransform, winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), winston.format.errors({ stack: true }), winston.format.json());
const consoleFormat = winston.format.combine(SanitizeTransform, winston.format.timestamp({ format: 'HH:mm:ss' }), winston.format.colorize(), winston.format.printf(({ timestamp, level, message, correlationId, context }) => {
    const cid = correlationId ? ` [${correlationId}]` : '';
    const ctx = context ? ` [${context}]` : '';
    return `${timestamp}${cid}${ctx} ${level}: ${message}`;
}));
let AppLoggerModule = class AppLoggerModule {
};
exports.AppLoggerModule = AppLoggerModule;
exports.AppLoggerModule = AppLoggerModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            nest_winston_1.WinstonModule.forRoot({
                level: process.env.LOG_LEVEL ?? 'info',
                transports: [
                    ...(process.env.NODE_ENV !== 'production'
                        ? [new winston.transports.Console({ format: consoleFormat })]
                        : []),
                    new winston.transports.File({
                        filename: 'logs/app.log',
                        format: jsonFormat,
                        maxsize: 10 * 1024 * 1024,
                        maxFiles: 30,
                        tailable: true,
                    }),
                    new winston.transports.File({
                        filename: 'logs/error.log',
                        level: 'error',
                        format: jsonFormat,
                        maxsize: 10 * 1024 * 1024,
                        maxFiles: 90,
                        tailable: true,
                    }),
                ],
            }),
        ],
    })
], AppLoggerModule);
//# sourceMappingURL=logger.module.js.map