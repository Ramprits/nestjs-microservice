import { Module } from '@nestjs/common';
import { LoggerModule as NestjsLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    NestjsLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}
