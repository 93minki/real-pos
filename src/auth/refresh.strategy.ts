import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(private readonly configService: ConfigService) {
    const secretOrKey = configService.get<string>('JWT_REFRESH_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.rt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: { id: string }) {
    return { userId: payload.id };
  }
}
