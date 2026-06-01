import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { IngresosService } from './services/ingresos.service';
import { IngresosController } from './controllers/ingresos.controller';
import { IngresoMapper } from './mapper/ingreso.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [IngresosController],
  providers: [IngresosService, IngresoMapper],
  exports: [IngresosService],
})
export class IngresosModule {}
