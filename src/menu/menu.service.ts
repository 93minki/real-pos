import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto, UpdateMenuDto } from './mongo/menu/menu.dto';
import { Menu } from './mongo/menu/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async createMenu(dto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(dto);
    return this.menuRepository.save(menu);
  }

  async updateMenu(id: number, dto: UpdateMenuDto): Promise<Menu> {
    await this.menuRepository.update(id, dto);
    return this.menuRepository.findOneBy({ id });
  }

  async deleteMenu(id: number): Promise<void> {
    await this.menuRepository.delete(id);
  }
}

// @Injectable()
// export class MenuService {
//   constructor(private readonly menuRepository: MenuMongoRepository) {}

//   async getAllMenu() {
//     return await this.menuRepository.getAllMenu();
//   }

//   async addMenu(menuDto: MenuDto) {
//     return await this.menuRepository.addMenu(menuDto);
//   }

//   async getMenu(id: string) {
//     return await this.menuRepository.getMenu(id);
//   }

//   async deleteMenu(id: string) {
//     return await this.menuRepository.deleteMenu(id);
//   }

//   async updateMenu(id: string, menuDto: MenuDto) {
//     return await this.menuRepository.updateMenu(id, menuDto);
//   }
// }
