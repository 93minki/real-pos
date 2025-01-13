import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/menu/mongo/menu/menu.entity';
import { Between, Repository } from 'typeorm';
import { CreateOrderDto } from './mongo/order/create-order.dto';
import { OrderItem } from './mongo/order/order-item.entity';
import { Order } from './mongo/order/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const items = await Promise.all(
      dto.items.map(async (item) => {
        const menu = await this.menuRepository.findOneBy({ id: item.menuId });
        if (!menu) {
          throw new Error(`Menu item ${item.menuId} not found`);
        }
        return this.orderItemRepository.create({
          menu,
          quantity: item.quantity,
        });
      }),
    );

    const order = this.orderRepository.create({
      user: { id: dto.userId },
      items,
    });

    return this.orderRepository.save(order);
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['items', 'items.menu', 'user'],
    });
  }
}

// @Injectable()
// export class OrderService {
//   constructor(private readonly orderRepository: OrderMongoRepository) {}

//   async addOrder(orderDto: OrderDto) {
//     return await this.orderRepository.addOrder(orderDto);
//   }

//   async getTodayOrder() {
//     return await this.orderRepository.getTodayOrder();
//   }

//   async getOrderByMonth(month: string) {
//     return await this.orderRepository.getOrderByMonth(month);
//   }

//   async getOrder(date: string, time: string) {
//     return await this.orderRepository.getOrder(date, time);
//   }

//   async deleteOrder(id: String) {
//     return await this.orderRepository.deleteOrder(id);
//   }

//   async updateOrder(id: string, orderDto: OrderDto) {
//     return await this.orderRepository.updateOrder(id, orderDto);
//   }

//   async getAllOrders() {
//     return await this.orderRepository.getAllOrders();
//   }
// }
