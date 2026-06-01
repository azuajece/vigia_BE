import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CuotasConceptosService } from './services/cuotas-conceptos.service';
import { CuotasConceptosController } from './controllers/cuotas-conceptos.controller';
import { CuotaConceptoMapper } from './mapper/cuota-concepto.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [CuotasConceptosController],
  providers: [CuotasConceptosService, CuotaConceptoMapper],
  exports: [CuotasConceptosService],
})
export class CuotasConceptosModule {}
