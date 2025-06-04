import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

// 쿠키와 Authorization 헤더에서 모두 토큰 추출 시도
const tokenExtractor = (req: Request): string | null => {
  // 1. 쿠키에서 먼저 시도
  if (req.cookies?.accessToken) {
    console.log('Token found in cookie');
    return req.cookies.accessToken;
  }

  // 2. Authorization 헤더에서 시도
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log('Token found in Authorization header');
    return authHeader.substring(7);
  }

  console.log('No token found in cookie or Authorization header');
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: tokenExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET', 'dev-secret'),
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
