import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtil {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(payload: {
    id: number;
    email: string;
    username: string;
  }): string {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '5m',
    });
  }

  createRefreshToken(payload: {
    id: number;
    email: string;
    username: string;
  }): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    return this.jwtService.sign(payload, { secret, expiresIn: '7d' });
  }

  verifyRefreshToken(token: string): any {
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new Error('Invalid Refresh Token');
    }
  }
}
