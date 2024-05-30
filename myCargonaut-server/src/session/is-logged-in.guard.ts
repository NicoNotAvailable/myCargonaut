import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { SessionData } from 'express-session';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
@ApiBearerAuth('loggedInGuard')
export class IsLoggedInGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const session: SessionData = req.session;

    return session.currentUser !== undefined;
  }
}
