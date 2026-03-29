import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'; // Import cookie-parser

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  });

  app.use(cookieParser()); // Use cookie-parser middleware
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // <- This line here
      },
    }),
  );
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
