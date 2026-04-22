import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Prisma 7 reads DATABASE_URL from environment automatically.
    // Connection URL is configured in prisma.config.prod.js (Docker)
    // or prisma.config.ts (local dev).
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
}
