import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';

@Entity()
export class Menu {
  @ObjectIdColumn()
  id?: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @ManyToOne(() => User, (user) => user.menus, { onDelete: 'CASCADE' })
  user: User;
}
