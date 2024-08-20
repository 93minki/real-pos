import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuDocument = Menu & Document;

@Schema({ timestamps: true })
export class Menu {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop({ default: true })
  active: boolean;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
