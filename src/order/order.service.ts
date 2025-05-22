import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Menu } from 'src/menu/menu.entity';
import { OrderItem } from 'src/order-item/order-item.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  async createOrder(
    user: { id: number; email: string },
    dto: CreateOrderDto,
  ): Promise<Order> {
    const order = this.orderRepository.create({
      user,
      status: dto.status || undefined,
    });
    const saveOrder = await this.orderRepository.save(order);

    const orderItems = dto.items.map((itemDto) =>
      this.orderItemRepository.create({
        order: saveOrder,
        menu: { id: itemDto.menuId } as Menu,
        quantity: itemDto.quantity,
      }),
    );
    await this.orderItemRepository.save(orderItems);

    return this.orderRepository.findOne({
      where: { id: saveOrder.id },
      relations: ['items', 'items.menu'],
    });
  }

  async getOrders(user: { id: number; email: string }): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: ['items', 'items.menu'],
      order: { created_at: 'DESC' },
    });
  }

  async getOrderById(
    orderId: number,
    user: { id: number; email: string },
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.menu'],
    });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
    if (order.user.id !== user.id)
      throw new ForbiddenException('본인의 주문만 볼 수 있습니다.');

    return plainToInstance(Order, order);
  }

  async updateOrder(
    orderId: number,
    dto: UpdateOrderDto,
    user: { id: number; email: string },
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
    if (order.user.id !== user.id)
      throw new ForbiddenException('본인의 주문만 수정할 수 있습니다.');

    Object.assign(order, dto);
    await this.orderRepository.save(order);
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.menu'],
    });
  }

  async deleteOrder(
    orderId: number,
    user: { id: number; email: string },
  ): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
    if (order.user.id !== user.id)
      throw new ForbiddenException('본인의 주문만 삭제할 수 있습니다.');

    await this.orderRepository.delete(orderId);
  }
}
