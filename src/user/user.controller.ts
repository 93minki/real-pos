import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Req() req: Request): Promise<any> {
    const user = req.user as { id: number; email: string };
    const userEntity = await this.userService.findOne(user.id);
    return instanceToPlain(userEntity);
  }

  @Put('me')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const user = req.user as { id: number; email: string };
    const userEntity = await this.userService.update(user.id, updateUserDto);
    return instanceToPlain(userEntity);
  }

  @Delete('me')
  async remove(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const user = req.user as { id: number; email: string };
      await this.userService.remove(user.id);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json({ code: 'OK', message: '회원탈퇴 성공' });
    } catch (error) {
      res.json({ code: 'FAIL', message: '회원탈퇴 실패' });
    }
  }
}
