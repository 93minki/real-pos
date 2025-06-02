// order.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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

  @Get('today')
  async getTodayOrders(@Req() req: Request) {
    const user = req.user as { id: number; email: string };
    return this.orderService.getTodayOrders(user);
  }

  @Get('monthly')
  async getMonthlyOrders(
    @Req() req: Request,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const user = req.user as { id: number; email: string };
    return this.orderService.getMonthlyOrders(user, year, month);
  }

  // 내 주문 단건 조회
  @Get(':id')
  async getOrderById(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as { id: number; email: string };
    return this.orderService.getOrderById(id, user);
  }

  // 주문 완료 (상태만 IN_PROGRESS -> COMPLETED로 변경)
  @Patch(':id/complete')
  async completeOrder(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as { id: number; email: string };
    return this.orderService.completeOrder(id, user);
  }

  // 주문 수정 (메뉴 수량 증감/삭제 등)
  @Patch(':id')
  async updateOrder(
    @Param('id') id: number,
    @Body() dto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    const user = req.user as { id: number; email: string };
    return this.orderService.updateOrder(id, dto, user);
  }

  // 주문 삭제
  @Delete(':id')
  async deleteOrder(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as { id: number; email: string };
    await this.orderService.deleteOrder(id, user);
    return { code: 'OK', message: '주문이 삭제되었습니다.' };
  }
}
