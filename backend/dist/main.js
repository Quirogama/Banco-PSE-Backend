"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    await app.listen(process.env.PORT ?? 3000);
    console.log(`🚀 Banco PSE ejecutándose en: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`📡 Endpoints oficiales:`);
    console.log(`   POST /crear-pago`);
    console.log(`   GET  /pagos/estado`);
    console.log(`   POST /pagos/reembolso`);
    console.log(`   POST /pagos/comprobante/validar`);
}
void bootstrap();
//# sourceMappingURL=main.js.map