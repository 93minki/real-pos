import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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
    } catch (error: any) {
      return { code: 'FAIL', message: `회원가입 실패: ${error.message}` };
    }
  }

  @Post('signin')
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.signin(dto);
      const isProd =
        this.configService.get<string>('NODE_ENV') === 'production';

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.json({
        code: 'OK',
        message: '로그인 성공',
      });
    } catch (error: any) {
      res.json({
        code: 'FAIL',
        message: `로그인 실패: ${error.message}`,
      });
    }
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      const result = await this.authService.refreshWithToken(refreshToken);
      if (result.code === 'OK') {
        const isProd =
          this.configService.get<string>('NODE_ENV') === 'production';
        if (result.refreshToken) {
          res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
        }
        if (result.accessToken) {
          res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 15,
          });
        }
        res.json({
          code: 'OK',
          message: '토큰 갱신 성공',
          user: result.user,
        });
      } else {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(401).json({ code: 'FAIL', message: '재로그인 필요' });
      }
    } catch (error) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(401).json({ code: 'FAIL', message: '재로그인 필요' });
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const user = req.user as any;
      await this.authService.logout(user.id);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json({ code: 'OK', message: '로그아웃 성공' });
    } catch (error: any) {
      res.json({
        code: 'FAIL',
        message: `로그아웃 실패: ${error.message}`,
      });
    }
  }
}
