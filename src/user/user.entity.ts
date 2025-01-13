import { Menu } from 'src/menu/mongo/menu/menu.entity';
import { Order } from 'src/order/mongo/order/order.entity';
import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id?: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDt: Date = new Date();

  @OneToMany(() => Menu, (menu) => menu.user)
  menus: Menu[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
