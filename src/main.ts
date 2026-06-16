import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Configuración de prefijo global para la API (ej: http://localhost:3000/api/v1/...)
  app.setGlobalPrefix('api/v1');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Arrow Maze API')
    .setDescription('Backend para el juego de laberinto Arrow Maze')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Servidor corriendo en: http://localhost:${port}/api/v1`);
  logger.log(`📝 Documentación Swagger en: http://localhost:${port}/api/docs`);
}
bootstrap();