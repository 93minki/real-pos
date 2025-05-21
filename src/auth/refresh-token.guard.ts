import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.cookies && req.cookies.refreshToken) {
      req.headers['authorization'] = `Bearer ` + req.cookies.refreshToken;
    }
    return req;
  }
}
