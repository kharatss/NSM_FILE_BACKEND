import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.enableCors()
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('File Management API') 
    .setDescription('API documentation for file and folder management') 
    .setVersion('1.0') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger UI at /api/docs

  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
