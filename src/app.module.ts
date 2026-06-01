import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { JugadoresModule } from './modules/jugadores/jugadores.module';
import { ConceptosCuotaModule } from './modules/conceptos-cuota/conceptos-cuota.module';
import { CuotasConceptosModule } from './modules/cuotas-conceptos/cuotas-conceptos.module';
import { CuotasMensualesModule } from './modules/cuotas-mensuales/cuotas-mensuales.module';
import { IngresosModule } from './modules/ingresos/ingresos.module';
import { FormasPagoModule } from './modules/formas-pago/formas-pago.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),
    PrismaModule,
    JugadoresModule,
    ConceptosCuotaModule,
    CuotasConceptosModule,
    CuotasMensualesModule,
    IngresosModule,
    FormasPagoModule,
  ],
})
export class AppModule {}
