import { Body, Controller, Delete, Get, Put, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { UpdateUserDto } from "./user.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Request() req):Promise<User> {
    return this.userService.findOne(req.user.id)
  }

  @Put('me')
  async updateProfile(@Request() req, @Body() UpdateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(req.user.id, UpdateUserDto);
  }

  @Delete('me')
  async remove(@Request() req):Promise<void> {
    return this.userService.remove(req.user.id)
  }
}