import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  const port = process.env.API_PORT || 3000;
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Configurar pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
    }),
  );

  // Configurar prefijo global
  app.setGlobalPrefix(apiPrefix);

  // Habilitar CORS
  app.enableCors({
      origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://azuajece.github.io/vigia'
  ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('El Vigía FC - API de Gestión de Jugadores')
    .setDescription(
      'API para gestionar jugadores, cuotas, pagos e ingresos del club El Vigía FC',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Jugadores', 'Gestión de jugadores del club')
    .addTag('Conceptos de Cuota', 'Tipos de conceptos de cuota')
    .addTag('Cuotas por Concepto', 'Cuotas anuales por concepto')
    .addTag('Cuotas Mensuales', 'Detalles de cuotas mensuales')
    .addTag('Ingresos/Pagos', 'Registro de ingresos y pagos')
    .addTag('Formas de Pago', 'Métodos de pago disponibles')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
  });

  await app.listen(port);

  logger.log(`✅ Aplicación ejecutándose en modo: ${nodeEnv}`);
  logger.log(`🚀 Servidor disponible en http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 Documentación disponible en http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
