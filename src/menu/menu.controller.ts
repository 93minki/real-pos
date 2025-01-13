import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './mongo/menu/menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async createMenu(@Body() dto: CreateMenuDto) {
    return this.menuService.createMenu(dto);
  }

  @Put(':id')
  async updateMenu(@Param('id') id: number, @Body() dto: UpdateMenuDto) {
    return this.menuService.updateMenu(id, dto);
  }

  @Delete(':id')
  async deleteMenu(@Param('id') id: number) {
    return this.menuService.deleteMenu(id);
  }
}

// @Controller('menu')
// export class MenuController {
//   constructor(private readonly menuService: MenuService) {}

//   @Get()
//   getAllMenu() {
//     return this.menuService.getAllMenu();
//   }

//   @Get('/:id')
//   getMenu(@Param('id') id: string) {
//     return this.menuService.getMenu(id);
//   }

//   @Post()
//   addMenu(@Body() menuDto: MenuDto) {
//     return this.menuService.addMenu(menuDto);
//   }

//   @Delete('/:id')
//   deleteMenu(@Param('id') id: string) {
//     return this.menuService.deleteMenu(id);
//   }

//   @Patch('/:id')
//   updateMenu(@Param('id') id: string, @Body() menuDto: MenuDto) {
//     return this.menuService.updateMenu(id, menuDto);
//   }
// }
