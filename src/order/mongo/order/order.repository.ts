import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDto } from './order.dto';
import { Order, OrderDocument } from './order.schema';

export interface OrderRepository {
  getAllOrders(): Promise<OrderDto[]>;
  getOrder(date: string, time: string): Promise<Order>;
  getTodayOrder(): Promise<OrderDto[]>;
  getOrderByDate(date: string): Promise<Order[]>;
  addOrder(orderDto: OrderDto): Promise<OrderDto>;
  deleteOrder(date: string, time: string): Promise<OrderDto>;
  updateOrder(id: string, items: OrderDto): Promise<OrderDto>;
}

@Injectable()
export class OrderMongoRepository implements OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async addOrder(orderDto: OrderDto): Promise<OrderDto> {
    const newOrder = new this.orderModel(orderDto);
    return await newOrder.save();
  }

  async getOrderByDate(date: string): Promise<OrderDto[]> {
    const startDate = new Date(`${date}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    return await this.orderModel
      .find({ updatedAt: { $gte: startDate, $lt: endDate } })
      .exec();
  }

  async getOrder(date: string, time: string): Promise<OrderDto> {
    return await this.orderModel.findOne({ date, time }).exec();
  }

  async getTodayOrder(): Promise<OrderDto[]> {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    return await this.orderModel
      .find({
        updatedAt: {
          $gte: start,
          $lt: end,
        },
      })
      .exec();
  }

  async deleteOrder(id: String): Promise<OrderDto> {
    return await this.orderModel.findByIdAndDelete(id).exec();
  }

  async updateOrder(id: string, orderDto: OrderDto): Promise<OrderDto> {
    console.log('orderDto', orderDto);
    const updateData: Partial<OrderDto> = {};
    if (orderDto.items) {
      updateData.items = orderDto.items;
    }

    if (orderDto.active !== undefined) {
      updateData.active = orderDto.active;
    }

    if (orderDto.totalPrice) {
      updateData.totalPrice = orderDto.totalPrice;
    }
    console.log('updateData', updateData);

    return await this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async getAllOrders(): Promise<OrderDto[]> {
    return await this.orderModel.find().exec();
  }
}
