import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderItemDto, UpdateOrderItemDto } from './order-item.dto';
import { OrderItemService } from './order-item.service';

@Controller('order-item')
@UseGuards(JwtAuthGuard)
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get('order/:orderId')
  async getByOrder(@Param('orderId') orderId: number) {
    return this.orderItemService.getByOrder(orderId);
  }

  @Post('order/:orderId')
  async create(
    @Param('orderId') orderId: number,
    @Body() dto: CreateOrderItemDto,
  ) {
    return this.orderItemService.create(dto, orderId);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateOrderItemDto) {
    return this.orderItemService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.orderItemService.delete(id);
    return { message: 'OrderItem 삭제 완료' };
  }
}
