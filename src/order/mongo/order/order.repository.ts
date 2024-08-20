import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDto } from './order.dto';
import { Order, OrderDocument } from './order.schema';

export interface OrderRepository {
  getAllOrders(): Promise<OrderDto[]>;
  getOrder(date: string, time: string): Promise<Order>;
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
    return await this.orderModel.find({ date }).exec();
  }

  async getOrder(date: string, time: string): Promise<OrderDto> {
    return await this.orderModel.findOne({ date, time }).exec();
  }

  async deleteOrder(id: String): Promise<OrderDto> {
    return await this.orderModel.findByIdAndDelete(id).exec();
  }

  async updateOrder(id: string, items: OrderDto): Promise<OrderDto> {
    return await this.orderModel
      .findByIdAndUpdate(id, { items }, { new: true })
      .exec();
  }

  async getAllOrders(): Promise<OrderDto[]> {
    return await this.orderModel.find().exec();
  }
}
