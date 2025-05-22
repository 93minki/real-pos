import { Menu } from 'src/menu/menu.entity';
import { Order } from 'src/order/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  store_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => Menu, (menu) => menu.user) // User[1] : Menu[N]
  menus: Menu[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
