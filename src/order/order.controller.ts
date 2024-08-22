import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderDto } from './mongo/order/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAllOrder() {
    return this.orderService.getAllOrders();
  }

  @Get('today')
  getTodayOrder() {
    return this.orderService.getTodayOrder();
  }

  @Get('/filter/date')
  getOrderByDate(@Query('date') date: string) {
    return this.orderService.getOrderByDate(date);
  }

  @Get('filter/date-time')
  getOrder(@Query('date') date: string, @Query('time') time: string) {
    return this.orderService.getOrder(date, time);
  }

  @Post()
  addOrder(@Body() orderDto: OrderDto) {
    return this.orderService.addOrder(orderDto);
  }

  @Delete('/:id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }

  @Patch('/:id')
  updateOrder(@Param('id') id: string, @Body() orderDto: OrderDto) {
    return this.orderService.updateOrder(id, orderDto);
  }
}
