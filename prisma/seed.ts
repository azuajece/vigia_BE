import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:vigia.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar datos existentes
  await prisma.ingreso.deleteMany();
  await prisma.cuotaMensualDetalle.deleteMany();
  await prisma.cuotaConcepto.deleteMany();
  await prisma.jugador.deleteMany();
  await prisma.formaPago.deleteMany();
  await prisma.conceptoCuota.deleteMany();

  console.log('🗑️  Datos anteriores eliminados');
  // Crear formas de pago
  const formasPago = await prisma.formaPago.createMany({
    data: [
      {
        nombre_forma: 'PAGO_MOVIL',
        descripcion: 'Pago Móvil',
        activa: true,
      },
      {
        nombre_forma: 'TRANSFERENCIA_BANCARIA',
        descripcion: 'Transferencia Bancaria',
        activa: true,
      },
      {
        nombre_forma: 'EFECTIVO',
        descripcion: 'Efectivo',
        activa: true,
      },
      {
        nombre_forma: 'CHEQUE',
        descripcion: 'Cheque',
        activa: true,
      },
      {
        nombre_forma: 'DEPOSITO',
        descripcion: 'Depósito en Banco',
        activa: true,
      },
      {
        nombre_forma: 'OTRO',
        descripcion: 'Otra forma de pago',
        activa: true,
      },
    ],
  });

  console.log('✅ Formas de pago creadas:', formasPago.count);

  // Crear conceptos de cuota
  const conceptosCuota = await prisma.conceptoCuota.createMany({
    data: [
      {
        nombre_concepto: 'INSCRIPCION',
        descripcion: 'Cuota de Inscripción Anual',
        tipo: 'INSCRIPCION' as const,
        activo: true,
      },
      {
        nombre_concepto: 'MENSUAL',
        descripcion: 'Cuota Mensual',
        tipo: 'MENSUAL' as const,
        activo: true,
      },
      {
        nombre_concepto: 'UNIFORMES',
        descripcion: 'Cuota de Uniformes',
        tipo: 'UNIFORME' as const,
        activo: true,
      },
      {
        nombre_concepto: 'CONMEBOL',
        descripcion: 'Cuota CONMEBOL',
        tipo: 'TORNEO' as const,
        activo: true,
      },
      {
        nombre_concepto: 'MUNICIPAL_AP',
        descripcion: 'Cuota Municipal AP',
        tipo: 'TORNEO' as const,
        activo: true,
      },
      {
        nombre_concepto: 'MUNICIPAL_CL',
        descripcion: 'Cuota Municipal CL',
        tipo: 'TORNEO' as const,
        activo: true,
      },
    ],
  });

  console.log('✅ Conceptos de cuota creados:', conceptosCuota.count);

  // Crear jugadores de ejemplo
  const jugadoresData = [
    {
      cedula: '34380660',
      nombre_apellido: 'Isaac Gabriel Vargas Nuñez',
      categoria: 'SUB-15',
      status: 'ACTIVO' as const,
      mes_ingreso: 'Enero',
      torneo: 'Liga Interna',
      anio_ingreso: 2024,
      deuda_2025: 0,
    },
    {
      cedula: '27555111',
      nombre_apellido: 'Carlos María García López',
      categoria: 'SUB-17',
      status: 'ACTIVO' as const,
      mes_ingreso: 'Febrero',
      torneo: 'Liga Interna',
      anio_ingreso: 2023,
      deuda_2025: 0,
    },
    {
      cedula: '15333222',
      nombre_apellido: 'Juan Pedro Rodríguez Silva',
      categoria: 'SUB-20',
      status: 'NUEVO_INGRESO' as const,
      mes_ingreso: 'Marzo',
      torneo: 'Liga Interna',
      anio_ingreso: 2024,
      deuda_2025: 150,
    },
  ];

  const jugadores = await Promise.all(
    jugadoresData.map((data) =>
      prisma.jugador.create({
        data,
      }),
    ),
  );

  console.log('✅ Jugadores creados:', jugadores.length);

  // Crear cuotas de conceptos
  for (const jugador of jugadores) {
    const currentYear = new Date().getFullYear();
    for (const concepto of [
      'INSCRIPCION',
      'UNIFORMES',
      'CONMEBOL',
      'MUNICIPAL_AP',
    ]) {
      const conceptoDb = await prisma.conceptoCuota.findUnique({
        where: { nombre_concepto: concepto },
      });

      if (conceptoDb) {
        await prisma.cuotaConcepto.create({
          data: {
            id_jugador: jugador.id_jugador,
            id_concepto: conceptoDb.id_concepto,
            anio: currentYear,
            monto:
              concepto === 'INSCRIPCION'
                ? 15
                : concepto === 'UNIFORMES'
                  ? 150
                  : concepto === 'CONMEBOL'
                    ? 50
                    : 30,
            pagado: concepto === 'INSCRIPCION',
            fecha_pago:
              concepto === 'INSCRIPCION'
                ? new Date()
                : null,
          },
        });
      }
    }
  }

  console.log('✅ Cuotas de conceptos creadas');

  console.log('🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
