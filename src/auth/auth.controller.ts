import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
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
    const user = await this.authService.signup(dto);
    return {
      message: '회원가입 성공',
      user: { id: user.id, email: user.email },
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as any;
    const oldRefreshToken = req.cookies['refreshToken'];
    const { accessToken, refreshToken } = await this.authService.refresh(
      user,
      oldRefreshToken,
    );
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({ accessToken });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any;
    console.log('user', user);
    await this.authService.logout(user.id);
    res.clearCookie('refreshToken');
    return { message: '로그아웃 성공' };
  }
}
