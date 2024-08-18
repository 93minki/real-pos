import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuDto } from './menu.dto';
import { Menu, MenuDocument } from './menu.schema';

export interface MenuRepository {
  getAllMenu(): Promise<MenuDto[]>;
  addMenu(menuDto: MenuDto): Promise<MenuDto>;
  getMenu(id: String): Promise<MenuDto>;
  deleteMenu(id: String): Promise<MenuDto>;
  updateMenu(id: String, menuDto: MenuDto): Promise<MenuDto>;
}

@Injectable()
export class MenuMongoRepository implements MenuRepository {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async getAllMenu(): Promise<MenuDto[]> {
    return await this.menuModel.find().exec();
  }

  async addMenu(menuDto: MenuDto): Promise<MenuDto> {
    const addMenu = {
      ...menuDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await this.menuModel.create(addMenu);
  }

  async getMenu(id: String): Promise<MenuDto> {
    return await this.menuModel.findById(id);
  }

  async deleteMenu(id: String): Promise<MenuDto> {
    return await this.menuModel.findByIdAndDelete(id);
  }

  async updateMenu(id: string, menuDto: MenuDto): Promise<MenuDto> {
    return await this.menuModel
      .findByIdAndUpdate(
        id,
        {
          ...menuDto,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }
}
