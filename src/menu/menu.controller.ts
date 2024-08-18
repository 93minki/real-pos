import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuDto } from './mongo/menu/menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getAllMenu() {
    return this.menuService.getAllMenu();
  }

  @Get('/:id')
  getMenu(@Param('id') id: string) {
    return this.menuService.getMenu(id);
  }

  @Post()
  addMenu(@Body() menuDto: MenuDto) {
    return this.menuService.addMenu(menuDto);
  }

  @Delete('/:id')
  deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }

  @Patch('/:id')
  updateMenu(@Param('id') id: string, @Body() menuDto: MenuDto) {
    return this.menuService.updateMenu(id, menuDto);
  }
}
