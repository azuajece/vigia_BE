import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ConceptosCuotaService } from './services/conceptos-cuota.service';
import { ConceptosCuotaController } from './controllers/conceptos-cuota.controller';
import { ConceptoCuotaMapper } from './mapper/concepto-cuota.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [ConceptosCuotaController],
  providers: [ConceptosCuotaService, ConceptoCuotaMapper],
  exports: [ConceptosCuotaService],
})
export class ConceptosCuotaModule {}
