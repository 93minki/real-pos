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
    console.log('=== JWT Guard Debug ===');
    console.log('Origin:', request.headers.origin);
    console.log('User-Agent:', request.headers['user-agent']);
    console.log('Cookie Header:', request.headers.cookie);
    console.log('All Headers:', JSON.stringify(request.headers, null, 2));
    console.log('Parsed Cookies:', request.cookies);
    console.log('Access Token:', request.cookies?.accessToken);
    console.log('=======================');

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
