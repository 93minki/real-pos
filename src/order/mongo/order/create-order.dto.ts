export class CreateOrderDto {
  userId: number;
  items: {
    menuId: number;
    quantity: number;
  }[];
}
