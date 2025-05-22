import { Exclude, Expose } from 'class-transformer';
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
  @Expose()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Expose()
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Expose()
  @Column({ type: 'varchar', length: 100 })
  store_name: string;

  @Exclude()
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Exclude()
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
