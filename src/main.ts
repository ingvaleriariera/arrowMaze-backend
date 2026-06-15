import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 📝 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Arrow Maze API')
    .setDescription('Documentación de la API para el backend del juego Arrow Maze')
    .setVersion('1.0')
    .addBearerAuth() // Dejado listo para cuando usemos el token JWT
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Si no encuentra el .env, usará el puerto 3000 por defecto por ahora
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Servidor corriendo en: http://localhost:${port}`);
  logger.log(`📝 Documentación Swagger en: http://localhost:${port}/api/docs`);
}
bootstrap();