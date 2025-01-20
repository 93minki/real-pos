import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './access.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenStrategy } from './refresh.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})], // 전역적으로 사용되는 옵션인데, at, rt 시크릿이 다르기 때문에 여기서는 비워둠
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
