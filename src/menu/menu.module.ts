import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuMongoRepository } from './mongo/menu/menu.repository';
import { Menu, MenuSchema } from './mongo/menu/menu.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  ],
  providers: [MenuService, MenuMongoRepository],
  controllers: [MenuController],
})
export class MenuModule {}
