import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenGuard } from './refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    try {
      await this.authService.signup(dto);
      return { code: 'OK', message: '회원가입 성공' };
    } catch (error) {
      return { code: 'FAIL', message: `회원가입 실패: ${error.message}` };
    }
  }

  @Post('signin')
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken, user } =
        await this.authService.signin(dto);
      const isProd =
        this.configService.get<string>('NODE_ENV') === 'production';

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.json({
        code: 'OK',
        message: '로그인 성공',
        accessToken,
        user: {
          id: user.id,
          eamil: user.email,
        },
      });
    } catch (error) {
      res.json({
        code: 'FAIL',
        message: `로그인 실패: ${error.message}`,
      });
    }
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = req.user as any;
      const oldRefreshToken = req.cookies['refreshToken'];
      const { accessToken, refreshToken } = await this.authService.refresh(
        user,
        oldRefreshToken,
      );
      const isProd =
        this.configService.get<string>('NODE_ENV') === 'production';

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.json({ code: 'OK', message: '토큰 갱신 성공', accessToken });
    } catch (error) {
      res.json({
        code: 'FAIL',
        message: `토큰 갱신 실패: ${error.message}`,
      });
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const user = req.user as any;
      await this.authService.logout(user.id);
      res.clearCookie('refreshToken');
      res.json({ code: 'OK', message: '로그아웃 성공' });
    } catch (error) {
      res.json({
        code: 'FAIL',
        message: `로그아웃 실패: ${error.message}`,
      });
    }
  }
}
