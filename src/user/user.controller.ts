import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './user.dto';
import { User } from './user.entity';
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
    @Body() UpdateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = req.user as { id: number; email: string };
    return this.userService.update(user.id, UpdateUserDto);
  }

  @Delete('me')
  async remove(@Req() req: Request): Promise<void> {
    const user = req.user as { id: number; email: string };
    return this.userService.remove(user.id);
  }
}
