-- CreateTable
CREATE TABLE "Jugador" (
    "id_jugador" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" TEXT NOT NULL,
    "nombre_apellido" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NUEVO_INGRESO',
    "mes_ingreso" TEXT,
    "fecha_egreso" DATETIME,
    "torneo" TEXT NOT NULL,
    "anio_ingreso" INTEGER,
    "deuda_2025" DECIMAL NOT NULL DEFAULT 0,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "conceptos_cuota" (
    "id_concepto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_concepto" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'OTRO',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "cuotas_conceptos" (
    "id_cuota_concepto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_jugador" INTEGER NOT NULL,
    "id_concepto" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "monto" DECIMAL NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_pago" DATETIME,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cuotas_conceptos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugador" ("id_jugador") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cuotas_conceptos_id_concepto_fkey" FOREIGN KEY ("id_concepto") REFERENCES "conceptos_cuota" ("id_concepto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cuotas_mensuales_detalle" (
    "id_cuota_mes" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_jugador" INTEGER NOT NULL,
    "id_concepto" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "monto" DECIMAL NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_pago" DATETIME,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cuotas_mensuales_detalle_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugador" ("id_jugador") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cuotas_mensuales_detalle_id_concepto_fkey" FOREIGN KEY ("id_concepto") REFERENCES "conceptos_cuota" ("id_concepto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "formas_pago" (
    "id_forma_pago" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_forma" TEXT NOT NULL,
    "descripcion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ingresos" (
    "id_ingreso" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_jugador" INTEGER NOT NULL,
    "concepto" TEXT NOT NULL,
    "mes_deuda" INTEGER NOT NULL DEFAULT 0,
    "fecha_pago" DATETIME NOT NULL,
    "id_forma_pago" INTEGER NOT NULL,
    "divisas" DECIMAL,
    "tasa_cambio" DECIMAL,
    "monto_bsf" DECIMAL,
    "monto_usd" DECIMAL,
    "referencia" TEXT,
    "notas" TEXT,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ingresos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugador" ("id_jugador") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ingresos_id_forma_pago_fkey" FOREIGN KEY ("id_forma_pago") REFERENCES "formas_pago" ("id_forma_pago") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Jugador_cedula_key" ON "Jugador"("cedula");

-- CreateIndex
CREATE INDEX "Jugador_cedula_idx" ON "Jugador"("cedula");

-- CreateIndex
CREATE INDEX "Jugador_categoria_idx" ON "Jugador"("categoria");

-- CreateIndex
CREATE INDEX "Jugador_status_idx" ON "Jugador"("status");

-- CreateIndex
CREATE UNIQUE INDEX "conceptos_cuota_nombre_concepto_key" ON "conceptos_cuota"("nombre_concepto");

-- CreateIndex
CREATE INDEX "conceptos_cuota_nombre_concepto_idx" ON "conceptos_cuota"("nombre_concepto");

-- CreateIndex
CREATE INDEX "cuotas_conceptos_id_jugador_idx" ON "cuotas_conceptos"("id_jugador");

-- CreateIndex
CREATE INDEX "cuotas_conceptos_id_concepto_idx" ON "cuotas_conceptos"("id_concepto");

-- CreateIndex
CREATE INDEX "cuotas_conceptos_anio_idx" ON "cuotas_conceptos"("anio");

-- CreateIndex
CREATE UNIQUE INDEX "cuotas_conceptos_id_jugador_id_concepto_anio_key" ON "cuotas_conceptos"("id_jugador", "id_concepto", "anio");

-- CreateIndex
CREATE INDEX "cuotas_mensuales_detalle_id_jugador_idx" ON "cuotas_mensuales_detalle"("id_jugador");

-- CreateIndex
CREATE INDEX "cuotas_mensuales_detalle_mes_anio_idx" ON "cuotas_mensuales_detalle"("mes", "anio");

-- CreateIndex
CREATE INDEX "cuotas_mensuales_detalle_pagado_idx" ON "cuotas_mensuales_detalle"("pagado");

-- CreateIndex
CREATE UNIQUE INDEX "cuotas_mensuales_detalle_id_jugador_id_concepto_mes_anio_key" ON "cuotas_mensuales_detalle"("id_jugador", "id_concepto", "mes", "anio");

-- CreateIndex
CREATE UNIQUE INDEX "formas_pago_nombre_forma_key" ON "formas_pago"("nombre_forma");

-- CreateIndex
CREATE INDEX "formas_pago_nombre_forma_idx" ON "formas_pago"("nombre_forma");

-- CreateIndex
CREATE INDEX "ingresos_id_jugador_idx" ON "ingresos"("id_jugador");

-- CreateIndex
CREATE INDEX "ingresos_fecha_pago_idx" ON "ingresos"("fecha_pago");

-- CreateIndex
CREATE INDEX "ingresos_referencia_idx" ON "ingresos"("referencia");

-- CreateIndex
CREATE INDEX "ingresos_id_forma_pago_idx" ON "ingresos"("id_forma_pago");
