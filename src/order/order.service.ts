import { Injectable } from '@nestjs/common';
import { OrderDto } from './mongo/order/order.dto';
import { OrderMongoRepository } from './mongo/order/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderMongoRepository) {}

  async addOrder(orderDto: OrderDto) {
    return await this.orderRepository.addOrder(orderDto);
  }

  async getTodayOrder() {
    return await this.orderRepository.getTodayOrder();
  }

  async getOrderByMonth(month: string) {
    return await this.orderRepository.getOrderByMonth(month);
  }

  async getOrder(date: string, time: string) {
    return await this.orderRepository.getOrder(date, time);
  }

  async deleteOrder(id: String) {
    return await this.orderRepository.deleteOrder(id);
  }

  async updateOrder(id: string, orderDto: OrderDto) {
    return await this.orderRepository.updateOrder(id, orderDto);
  }

  async getAllOrders() {
    return await this.orderRepository.getAllOrders();
  }
}
