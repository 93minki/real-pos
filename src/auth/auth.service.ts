import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { SigninDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { verifyTokenStatus } from './jwt.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<User> {
    const exists = await this.userRepository.findOneBy({ email: dto.email });
    if (exists) throw new UnauthorizedException('이미 존재하는 이메일입니다.');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      store_name: dto.store_name,
      phone: dto.phone,
    });
    return this.userRepository.save(user);
  }

  async signin(dto: SigninDto) {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user)
      throw new UnauthorizedException('이메일/비밀번호가 일치하지 않습니다.');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid)
      throw new UnauthorizedException('이메일/비밀번호가 일치하지 않습니다.');

    const tokens = await this.issueTokens(user.id, user.email);

    const hashedRt = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.update(user.id, { refreshToken: hashedRt });

    return {
      ...tokens,
      user: { id: user.id, email: user.email, store_name: user.store_name },
    };
  }

  async issueTokens(userId: number, email: string) {
    const jwtSecret = this.configService.get<string>(
      'JWT_ACCESS_SECRET',
      'dev-secret',
    );
    const jwtRefreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'rt-dev-secret',
    );
    const jwtExpiresIn = this.configService.get<string>(
      'JWT_EXPIRES_IN',
      '15m',
    );
    const jwtRefreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: jwtSecret, expiresIn: jwtExpiresIn },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: jwtRefreshSecret, expiresIn: jwtRefreshExpiresIn },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });
    return { message: 'Logged out' };
  }

  /**
   * refreshToken만 받아서 RT 검증 및 AT/RT 재발급, 위조/만료 구분, 일관된 응답 반환
   */
  async refreshWithToken(refreshToken: string) {
    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'rt-dev-secret',
    );
    const rtResult = verifyTokenStatus(refreshToken, refreshSecret);
    if (rtResult.status !== 'VALID') {
      // RT 만료 또는 위조
      return { code: 'FAIL', message: '재로그인 필요' };
    }
    const { sub: userId, email } = rtResult.decoded;
    const dbUser = await this.userRepository.findOneBy({ id: userId });
    if (!dbUser) {
      return { code: 'FAIL', message: '재로그인 필요' };
    }
    // RT 위조(서명은 맞지만 DB에 저장된 RT와 다름)
    const rtMatch = await bcrypt.compare(refreshToken, dbUser.refreshToken);
    if (!rtMatch) {
      return { code: 'FAIL', message: '재로그인 필요' };
    }
    // RT 만료 임박(3일 이하)이면 RT도 재발급, 아니면 기존 RT 유지
    const remainDay = (rtResult.remain ?? 0) / (60 * 60 * 24);
    let newAccessToken: string;
    let newRefreshToken: string = refreshToken;
    if (remainDay < 3) {
      const tokens = await this.issueTokens(userId, email);
      newAccessToken = tokens.accessToken;
      newRefreshToken = tokens.refreshToken;
      const hashedRt = await bcrypt.hash(newRefreshToken, 10);
      await this.userRepository.update(userId, { refreshToken: hashedRt });
    } else {
      const tokens = await this.issueTokens(userId, email);
      newAccessToken = tokens.accessToken;
    }
    return {
      code: 'OK',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        store_name: dbUser.store_name,
      },
    };
  }
}
