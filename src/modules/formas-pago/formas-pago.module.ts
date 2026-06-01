import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { FormasPagoService } from './services/formas-pago.service';
import { FormasPagoController } from './controllers/formas-pago.controller';
import { FormaPagoMapper } from './mapper/forma-pago.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [FormasPagoController],
  providers: [FormasPagoService, FormaPagoMapper],
  exports: [FormasPagoService],
})
export class FormasPagoModule {}
