import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/audit/audit.service';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as Request;
    const { user, method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';

    return next.handle().pipe(
      tap({
        next: (data) => {
          if (user) {
            this.auditService.logAudit({
              userId: user.id,
              action: `${method} ${url}`,
              details: {
                method,
                url,
                status: 200,
                data: JSON.stringify(data).slice(0, 1000),
              },
              ipAddress: ip,
              userAgent,
            });
          }
        },
        error: (error) => {
          if (user) {
            this.auditService.logAudit({
              userId: user.id,
              action: `${method} ${url}`,
              details: {
                method,
                url,
                status: error.status || 500,
                error: error.message,
              },
              ipAddress: ip,
              userAgent,
            });
          }
        },
      }),
    );
  }
}