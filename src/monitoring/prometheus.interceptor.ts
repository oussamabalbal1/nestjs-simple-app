// prometheus.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrometheusService } from './prometheus.service';
import { Request, Response } from 'express';
import { performance } from 'perf_hooks';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  constructor(private readonly prometheusService: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = performance.now();

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        const duration = (performance.now() - start) / 1000; // seconds
        const route = request.route?.path || request.url;
        const method = request.method;
        const status = response.statusCode.toString();

        this.prometheusService.httpRequestsTotal.inc({
          method,
          route,
          status,
        });

        this.prometheusService.httpRequestDurationSeconds.observe(
          { method, route, status },
          duration,
        );
      }),
    );
  }
}
