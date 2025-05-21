import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Menu } from './menu/menu.entity';
import { MenuModule } from './menu/menu.module';
import { Order } from './order/order.entity';
import { OrderModule } from './order/order.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNMAE', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'real_pos'),
        entities: [User, Menu, Order],
        synchronize: true,
        logging: true,
        charset: 'utf8mb4_unicode_ci',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MenuModule,
    OrderModule,
    AuthModule,
    OrderItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
