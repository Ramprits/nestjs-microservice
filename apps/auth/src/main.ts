import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './authentication/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    logger: false,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  const config = app.get(ConfigService);
  app.use(cookieParser());
  app.use(
    helmet({
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );
  const PORT = config.get<number>('PORT') || 3100;
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}
bootstrap();
