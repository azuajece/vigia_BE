import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CuotasMensualesService } from './services/cuotas-mensuales.service';
import { CuotasMensualesController } from './controllers/cuotas-mensuales.controller';
import { CuotaMensualDetalleMapper } from './mapper/cuota-mensual-detalle.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [CuotasMensualesController],
  providers: [CuotasMensualesService, CuotaMensualDetalleMapper],
  exports: [CuotasMensualesService],
})
export class CuotasMensualesModule {}
