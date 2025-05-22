// order.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { OrderService } from './order.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 주문 생성
  @Post()
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const user = req.user as { id: number; email: string };
    return this.orderService.createOrder(user, dto);
  }

  // 내 주문 전체 조회
  @Get()
  async getOrders(@Req() req: Request) {
    const user = req.user as { id: number; email: string };
    return this.orderService.getOrders(user);
  }

  // 내 주문 단건 조회
  @Get(':id')
  async getOrderById(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as { id: number; email: string };
    return this.orderService.getOrderById(Number(id), user);
  }

  // 주문 수정
  @Put(':id')
  async updateOrder(
    @Param('id') id: number,
    @Body() dto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    const user = req.user as { id: number; email: string };
    return this.orderService.updateOrder(Number(id), dto, user);
  }

  // 주문 삭제
  @Delete(':id')
  async deleteOrder(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as { id: number; email: string };
    return this.orderService.deleteOrder(Number(id), user);
  }
}
