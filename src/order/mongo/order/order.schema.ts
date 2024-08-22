import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop([{ name: String, price: Number, quantity: Number }])
  items?: { name: string; price: number; quantity: number }[];

  @Prop({ default: true })
  active?: boolean;

  @Prop()
  totalPrice?: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
