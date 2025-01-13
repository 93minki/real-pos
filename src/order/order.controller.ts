import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateOrderDto } from './mongo/order/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Get('stats')
  async getOrdersByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.orderService.getOrdersByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }
}

// @Controller('order')
// export class OrderController {
//   constructor(private readonly orderService: OrderService) {}

//   @Get()
//   getAllOrder() {
//     return this.orderService.getAllOrders();
//   }

//   @Get('today')
//   getTodayOrder() {
//     return this.orderService.getTodayOrder();
//   }

//   @Get('/filter')
//   getOrderByMonth(@Query('month') month: string) {
//     return this.orderService.getOrderByMonth(month);
//   }

//   @Get('filter/date-time')
//   getOrder(@Query('date') date: string, @Query('time') time: string) {
//     return this.orderService.getOrder(date, time);
//   }

//   @Post()
//   addOrder(@Body() orderDto: OrderDto) {
//     return this.orderService.addOrder(orderDto);
//   }

//   @Delete('/:id')
//   deleteOrder(@Param('id') id: string) {
//     return this.orderService.deleteOrder(id);
//   }

//   @Patch('/:id')
//   updateOrder(@Param('id') id: string, @Body() orderDto: OrderDto) {
//     return this.orderService.updateOrder(id, orderDto);
//   }
// }
