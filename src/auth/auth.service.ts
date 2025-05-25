import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

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

  async login(dto: LoginDto) {
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

  async refresh(user: { id: number; email: string }, refreshToken: string) {
    const dbUser = await this.userRepository.findOneBy({ id: user.id });
    if (!dbUser?.refreshToken)
      throw new ForbiddenException('No refresh token in DB');

    const rtMatch = await bcrypt.compare(refreshToken, dbUser.refreshToken);
    if (!rtMatch) throw new ForbiddenException('Invalid refresh token');

    const tokens = await this.issueTokens(dbUser.id, dbUser.email);
    const hashedRt = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.update(dbUser.id, { refreshToken: hashedRt });
    return tokens;
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });
    return { message: 'Logged out' };
  }
}
