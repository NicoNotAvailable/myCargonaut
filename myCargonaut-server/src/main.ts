import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import * as express from 'express';

declare module 'express-session' {
  interface SessionData {
    currentUser?: number;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('My Cargonaut')
    .setDescription('My Cargonaut API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: '50mb' }));

  await app.listen(3000);
}
bootstrap();
