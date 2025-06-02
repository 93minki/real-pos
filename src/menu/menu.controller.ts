import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
import { MenuService } from './menu.service';

@UseGuards(JwtAuthGuard) // 전체에 인증 적용
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async createMenu(@Req() req: Request, @Body() dto: CreateMenuDto) {
    // req.user는 JwtStrategy의 validate에서 리턴한 값
    const user = req.user as { id: number; email: string };
    return this.menuService.createMenu(user, dto);
  }

  @Get()
  async getMenus(@Req() req: Request) {
    const user = req.user as { id: number; email: string };
    return this.menuService.getMenus(user);
  }

  @Patch(':id')
  async updateMenu(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateMenuDto,
  ) {
    const user = req.user as { id: number; email: string };
    return this.menuService.updateMenu(user, +id, dto);
  }
}
