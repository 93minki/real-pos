// order.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  // 주문 생성
  async createOrder(
    dto: CreateOrderDto,
    user: { id: number; email: string },
  ): Promise<Order> {
    const order = this.orderRepository.create({
      ...dto,
      user,
    });
    return this.orderRepository.save(order);
  }

  // 주문 전체 조회 (내 주문만)
  async getOrders(user: { id: number; email: string }): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'orderItems', 'orderItems.menu'],
    });
  }

  // 주문 단일 조회 (본인 것만)
  async getOrderById(
    id: number,
    user: { id: number; email: string },
  ): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['user', 'orderItems', 'orderItems.menu'],
    });
  }

  // 주문 수정 (ex. 상태변경 등)
  async updateOrder(
    id: number,
    dto: UpdateOrderDto,
    user: { id: number; email: string },
  ): Promise<Order | null> {
    const order = await this.getOrderById(id, user);
    if (!order) return null;
    Object.assign(order, dto);
    return this.orderRepository.save(order);
  }

  // 주문 삭제 (본인 것만)
  async deleteOrder(
    id: number,
    user: { id: number; email: string },
  ): Promise<void> {
    await this.orderRepository.delete({ id, user: { id: user.id } });
  }
}
