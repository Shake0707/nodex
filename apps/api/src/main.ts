import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Trust the Nginx reverse proxy so secure cookies work
  app.set('trust proxy', 1);

  // API prefix
  app.setGlobalPrefix('api');

  // Security headers (CSP disabled — API serves images to separate frontend)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Global validation — strip unknown properties
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS — dynamic from env
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Session secret — must be set in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret && process.env.NODE_ENV === 'production') {
    throw new Error(
      'SESSION_SECRET environment variable is required in production',
    );
  }

  // Session middleware
  app.use(
    session({
      secret: sessionSecret || 'nodex-dev-secret-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  // Serve uploaded files as static (bypass NestJS global prefix)
  const uploadsPath = join(process.cwd(), 'uploads');
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(
    '/uploads',
    express.static(uploadsPath, {
      dotfiles: 'deny',
      index: false,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
}
void bootstrap();
