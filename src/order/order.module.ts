import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/menu/menu.entity';
import { OrderItem } from 'src/order-item/order-item.entity';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderSseController } from './order.sse.controller';
import { OrderSseService } from './order.sse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Menu])],
  providers: [OrderService, OrderSseService],
  controllers: [OrderSseController, OrderController],
  exports: [OrderService],
})
export class OrderModule {}
