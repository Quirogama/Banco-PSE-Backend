"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 3000);
    console.log(`🚀 Servidor ejecutándose en: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`📡 API disponible en: http://localhost:${process.env.PORT ?? 3000}/api`);
}
void bootstrap();
//# sourceMappingURL=main.js.map