import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
import { Menu } from './menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  async createMenu(
    user: { id: number; email: string },
    dto: CreateMenuDto,
  ): Promise<Menu> {
    const menu = this.menuRepository.create({
      ...dto,
      user,
    });
    return this.menuRepository.save(menu);
  }

  async getMenus(user: { id: number; email: string }): Promise<Menu[]> {
    return this.menuRepository.find({
      where: { user: { id: user.id } },
      order: { created_at: 'DESC' },
    });
  }

  async updateMenu(
    user: { id: number; email: string },
    menuId: number,
    dto: UpdateMenuDto,
  ): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id: menuId, user: { id: user.id } },
    });
    if (!menu) throw new NotFoundException('메뉴 없음');
    Object.assign(menu, dto);
    return this.menuRepository.save(menu);
  }

  async deleteMenu(
    user: { id: number; email: string },
    menuId: number,
  ): Promise<void> {
    const menu = await this.menuRepository.findOne({
      where: { id: menuId, user: { id: user.id } },
    });
    if (!menu) throw new NotFoundException('메뉴 없음');
    await this.menuRepository.delete(menuId);
  }
}
