import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

const cookieExtractor = (req: Request): string | null => {
  return req?.cookies?.refreshToken || null;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_REFRESH_SECRET',
        'refresh-dev-secret',
      ),
      passReqToCallback: false,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
