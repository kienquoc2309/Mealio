import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const frontendUrl = configService.get<string>('app.frontendUrl');

  app.enableCors({ origin: frontendUrl, credentials: true });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port!);
  Logger.log(`Server is running on port ${port}`, 'Bootstrap');
}
bootstrap();
