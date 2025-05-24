import { Menu } from 'src/menu/menu.entity';
import { Order } from 'src/order/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Menu)
  menu: Menu;

  @Column('int')
  quantity: number;

  @Column('int')
  price: number;
}
