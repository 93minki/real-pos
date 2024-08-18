import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderMongoRepository } from './mongo/order/order.repository';
import { Order, OrderSchema } from './mongo/order/order.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrderService, OrderMongoRepository],
  controllers: [OrderController],
})
export class OrderModule {}
