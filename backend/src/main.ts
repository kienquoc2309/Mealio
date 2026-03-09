import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const frontendUrl = configService.get<string>('app.frontendUrl');

  app.enableCors({ origin: frontendUrl, credentials: true });

  await app.listen(port!);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
