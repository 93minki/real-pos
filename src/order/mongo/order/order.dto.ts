export interface OrderItemDto {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDto {
  items: OrderItemDto[];
}
