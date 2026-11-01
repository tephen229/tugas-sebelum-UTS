import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './interceptors/transform-response/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validasi global: field di luar DTO ditolak, tipe data dikonversi otomatis
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // semua response dibungkus format standar { success, statusCode, message, data }
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();