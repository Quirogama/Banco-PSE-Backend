import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  });

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Servidor ejecutándose en: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📡 API disponible en: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
void bootstrap();
