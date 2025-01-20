import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './mongo/auth/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(body);

    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const newAccessToken = await this.authService.refreshToken(oldRefreshToken);

    // Refresh Token이 만료 1일 전이면 새로운 Refresh Token 발급
    const newRefreshToken = req.cookies.refreshToken; // 갱신 필요 여부 확인 로직 추가 가능
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: newAccessToken };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.body.userId; // 요청으로부터 유저 ID를 받음
    await this.authService.logout(userId);

    // 쿠키에서 Refresh Token 삭제
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }
}
