import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const { method, path } = request;

    this.logger.debug(
      `${method} ${path}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    );

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} response: \n ${JSON.stringify(res)} `,
        );
      }),
    );
  }
}
