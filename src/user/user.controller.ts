import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RegisterUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  createUser(@Body() user: RegisterUserDto) {
    return this.userService.createUser(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Get(':email')
  async findUserByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
