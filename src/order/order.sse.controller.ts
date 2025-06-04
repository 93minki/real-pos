import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderSseService } from './order.sse.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderSseController {
  constructor(
    private readonly orderSseService: OrderSseService,
    private readonly configService: ConfigService,
  ) {}

  @Get('sse')
  sse(@Req() req: Request, @Res() res: Response) {
    console.log('SSE connection established');
    const userId = req.user as { id: number; email: string };

    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': frontendUrl,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Cache-Control',
      'X-Accel-Buffering': 'no',
    });

    res.flushHeaders();

    console.log('Adding client for user:', userId.id.toString());

    this.orderSseService.addClient(userId.id.toString(), res);

    res.on('close', () => {
      this.orderSseService.removeClient(userId.id.toString(), res);
    });

    return res;
  }
}
