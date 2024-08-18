import { Injectable } from '@nestjs/common';
import { MenuDto } from './mongo/menu/menu.dto';
import { MenuMongoRepository } from './mongo/menu/menu.repository';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuMongoRepository) {}

  async getAllMenu() {
    return await this.menuRepository.getAllMenu();
  }

  async addMenu(menuDto: MenuDto) {
    return await this.menuRepository.addMenu(menuDto);
  }

  async getMenu(id: string) {
    return await this.menuRepository.getMenu(id);
  }

  async deleteMenu(id: string) {
    return await this.menuRepository.deleteMenu(id);
  }

  async updateMenu(id: string, menuDto: MenuDto) {
    return await this.menuRepository.updateMenu(id, menuDto);
  }
}
