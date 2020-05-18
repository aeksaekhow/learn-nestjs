import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule);
  const port = 8080
  await app.listen(port);

  logger.log('Application starts listening on port ' + port)
}
bootstrap();
