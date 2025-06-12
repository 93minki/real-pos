import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class OrderSseService {
  private clients: Map<string, Set<Response>> = new Map();

  addClient(userId: string, res: Response) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(res);
  }

  removeClient(userId: string, res: Response) {
    if (this.clients.has(userId)) {
      this.clients.get(userId)!.delete(res);
      if (this.clients.get(userId)!.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  sendOrderAddedEvent(userId: string) {
    if (!this.clients.has(userId)) return;
    const userClients = this.clients.get(userId);
    if (!userClients) return;
    for (const res of userClients) {
      res.write(`event: orderAdded\ndata: {}\n\n`);
    }
  }
}
