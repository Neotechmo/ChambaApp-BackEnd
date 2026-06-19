"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const nest_winston_1 = require("nest-winston");
const app_module_1 = require("./app.module");
const metrics_interceptor_1 = require("./common/interceptors/metrics.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalInterceptors(new metrics_interceptor_1.MetricsInterceptor(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    const logger = app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER);
    logger.log(`ChambaApp corriendo en puerto ${port}`, 'Bootstrap');
}
void bootstrap();
//# sourceMappingURL=main.js.map