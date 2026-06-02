import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // ✅ allows ANY frontend (5173, 5174, etc.)
    credentials: true,
  });

  app.useGlobalInterceptors(
  new ClassSerializerInterceptor(
    app.get(Reflector),
  ),
);

  await app.listen(3000);
}
bootstrap();