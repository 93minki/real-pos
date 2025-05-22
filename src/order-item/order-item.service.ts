import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/menu/menu.entity';
import { Order } from 'src/order/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto, UpdateOrderItemDto } from './order-item.dto';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(dto: CreateOrderItemDto, orderId: number): Promise<OrderItem> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');

    const menu = await this.menuRepository.findOneBy({ id: dto.menuId });
    if (!menu) throw new NotFoundException('메뉴를 찾을 수 없습니다.');

    const orderItem = this.orderItemRepository.create({
      order,
      menu,
      quantity: dto.quantity,
      price: dto.price,
    });

    return this.orderItemRepository.save(orderItem);
  }

  async update(id: number, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOneBy({ id });
    if (!orderItem) throw new NotFoundException('OrderItem Not Found');
    Object.assign(orderItem, dto);
    return this.orderItemRepository.save(orderItem);
  }

  async delete(id: number): Promise<void> {
    await this.orderItemRepository.delete(id);
  }

  async getByOrder(orderId: number): Promise<OrderItem[]> {
    return this.orderItemRepository.find({
      where: { order: { id: orderId } },
      relations: ['menu', 'order'],
    });
  }
}
