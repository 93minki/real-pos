import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { OrderSseService } from './order.sse.service';

@Controller('orders')
export class OrderSseController {
  constructor(
    private readonly orderSseService: OrderSseService,
    private readonly configService: ConfigService,
  ) {}

  @Get('sse')
  sse(
    @Query('userId') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // userId 검증
    if (!userId) {
      throw new BadRequestException('userId 쿼리 파라미터가 필요합니다');
    }

    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    // SSE 헤더 설정
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin':
        process.env.NODE_ENV === 'production'
          ? frontendUrl
          : 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Cache-Control',
      'X-Accel-Buffering': 'no',
    });

    // 헤더 즉시 전송
    res.flushHeaders();

    // 연결 확인 메시지 전송
    res.write(`: SSE connection established for user ${userId}\n\n`);

    this.orderSseService.addClient(userId, res);

    // Heartbeat 추가 (연결 유지)
    const heartbeat = setInterval(() => {
      try {
        res.write(`: heartbeat\n\n`);
      } catch (error) {
        clearInterval(heartbeat);
      }
    }, 30000);

    // 연결 종료 처리
    req.on('close', () => {
      clearInterval(heartbeat);
      this.orderSseService.removeClient(userId, res);
    });

    res.on('close', () => {
      clearInterval(heartbeat);
      this.orderSseService.removeClient(userId, res);
    });

    // 응답 객체 반환하지 않음 (연결 유지)
  }
}
