import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { PrometheusService } from './monitoring/prometheus.service';
import { PrometheusInterceptor } from './monitoring/prometheus.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set up static assets and views directory
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const prometheusService = app.get(PrometheusService);
  app.useGlobalInterceptors(new PrometheusInterceptor(prometheusService));
  
  await app.listen(3000,'0.0.0.0');
  console.log('Application is running on http://localhost:3000');
}
bootstrap();
