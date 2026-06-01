import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
//import Database from 'better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
const adapter = new PrismaBetterSqlite3({ url: 'file:vigia.db' });
//const prisma = new PrismaClient({ adapter });
    super({
      adapter,
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Conectado a la base de datos');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('❌ Desconectado de la base de datos');
  }
}
