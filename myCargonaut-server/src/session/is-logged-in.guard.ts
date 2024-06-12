import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SessionData } from 'express-session';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
@ApiBearerAuth('loggedInGuard')
export class IsLoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const session: SessionData = req.session;

    if (session.currentUser !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}
