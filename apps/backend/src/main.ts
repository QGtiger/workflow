import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvokeRecordInterceptor } from './common/invoke-record.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.enableCors();

  const appConfig = app.get(ConfigService);
  await app.listen(appConfig.get('NEST_PORT'));
}
bootstrap();
