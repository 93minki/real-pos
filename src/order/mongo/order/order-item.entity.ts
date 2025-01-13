import { Menu } from 'src/menu/mongo/menu/menu.entity';
import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @ObjectIdColumn()
  id?: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Menu)
  menu: Menu;

  @Column()
  quantity: number;
}
