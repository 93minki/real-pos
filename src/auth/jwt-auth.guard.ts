import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('JWT Guard - Cookies:', request.cookies);
    console.log('JWT Guard - Access Token:', request.cookies?.accessToken);

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('JWT Guard - Error:', err);
    console.log('JWT Guard - User:', user);
    console.log('JWT Guard - Info:', info);

    if (err || !user) {
      throw err || new UnauthorizedException('인증되지 않은 사용자입니다.');
    }
    return user;
  }
}
