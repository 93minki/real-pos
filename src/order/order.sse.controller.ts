import { Controller, Get, Options, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderSseService } from './order.sse.service';

@Controller('orders')
export class OrderSseController {
  constructor(
    private readonly orderSseService: OrderSseService,
    private readonly configService: ConfigService,
  ) {}

  // CORS preflight 처리
  @Options('sse')
  handleOptions(@Res() res: Response) {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    res.set({
      'Access-Control-Allow-Origin': frontendUrl,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Accept, Cache-Control, Authorization',
      'Access-Control-Max-Age': '86400',
    });
    res.status(204).send();
  }

  @UseGuards(JwtAuthGuard)
  @Get('sse')
  sse(@Req() req: Request, @Res() res: Response) {
    console.log('=== SSE Connection Starting ===');
    const userId = req.user as { id: number; email: string };
    console.log('Authenticated user:', userId);

    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    // SSE 헤더 설정
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': frontendUrl,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers':
        'Content-Type, Accept, Cache-Control, Authorization',
      'X-Accel-Buffering': 'no',
    });

    // 헤더 즉시 전송
    res.flushHeaders();

    // 연결 확인 메시지 전송
    res.write(`: SSE connection established for user ${userId.id}\n\n`);

    console.log('Adding client for user:', userId.id.toString());
    this.orderSseService.addClient(userId.id.toString(), res);

    // Heartbeat 추가 (연결 유지)
    const heartbeat = setInterval(() => {
      try {
        res.write(`: heartbeat\n\n`);
      } catch (error) {
        console.log('Heartbeat failed, connection likely closed');
        clearInterval(heartbeat);
      }
    }, 30000);

    // 연결 종료 처리
    req.on('close', () => {
      console.log('SSE connection closed for user:', userId.id.toString());
      clearInterval(heartbeat);
      this.orderSseService.removeClient(userId.id.toString(), res);
    });

    res.on('close', () => {
      console.log('Response closed for user:', userId.id.toString());
      clearInterval(heartbeat);
      this.orderSseService.removeClient(userId.id.toString(), res);
    });

    // 응답 객체 반환하지 않음 (연결 유지)
  }
}
