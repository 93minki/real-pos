import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  menuId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

export class UpdateOrderItemDto {
  @IsOptional()
  @IsInt()
  quantity: number;
}
