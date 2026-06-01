import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JugadoresService } from './services/jugadores.service';
import { JugadoresController } from './controllers/jugadores.controller';
import { JugadorMapper } from './mapper/jugador.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [JugadoresController],
  providers: [JugadoresService, JugadorMapper],
  exports: [JugadoresService],
})
export class JugadoresModule {}
