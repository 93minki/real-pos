import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { JwtUtil } from './jwt.util';
import { SignInDto, SignUpDto } from './mongo/auth/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtUtil: JwtUtil,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(user: SignUpDto): Promise<User> {
    const { email, password, username } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async login(
    loginInfo: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginInfo;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtUtil.createAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });
    const refreshToken = this.jwtUtil.createRefreshToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    user.rt = refreshToken;
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  async refreshToken(oldToken: string): Promise<string> {
    const payload = this.jwtUtil.verifyRefreshToken(oldToken);

    const user = await this.userRepository.findOne({
      where: { id: payload.id, rt: oldToken },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.jwtUtil.createAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.rt = null;
    await this.userRepository.save(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const { password: hashedPassword, ...userInfo } = user;
    if (bcrypt.compareSync(password, hashedPassword)) {
      return userInfo;
    }
    return null;
  }
}
