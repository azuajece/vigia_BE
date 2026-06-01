-- =====================================================
-- ESQUEMA DE BASE DE DATOS - EL VIGIA FC
-- Módulo: Gestión de Jugadores y Cuotas
-- Fecha: 2026-05-29
-- =====================================================

-- =====================================================
-- 1. TABLA DE JUGADORES
-- =====================================================
CREATE TABLE IF NOT EXISTS jugadores (
    id_jugador INT PRIMARY KEY AUTO_INCREMENT,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre_apellido VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    status ENUM('Nuevo Ingreso', 'Activo', 'Inactivo') DEFAULT 'Nuevo Ingreso',
    mes_ingreso VARCHAR(10),
    fecha_egreso DATE NULL,
    torneo VARCHAR(100) NOT NULL,
    anio_ingreso INT,
    deuda_2025 DECIMAL(10, 2) DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cedula (cedula),
    INDEX idx_categoria (categoria),
    INDEX idx_status (status)
);

-- =====================================================
-- 2. TABLA DE CONCEPTOS DE CUOTA
-- =====================================================
CREATE TABLE IF NOT EXISTS conceptos_cuota (
    id_concepto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_concepto VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    tipo ENUM('Inscripción', 'Mensual', 'Uniforme', 'Torneo', 'Otro') DEFAULT 'Otro',
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre_concepto)
);

-- =====================================================
-- 3. TABLA DE CUOTAS POR CONCEPTO (Anuales)
-- =====================================================
CREATE TABLE IF NOT EXISTS cuotas_conceptos (
    id_cuota_concepto INT PRIMARY KEY AUTO_INCREMENT,
    id_jugador INT NOT NULL,
    id_concepto INT NOT NULL,
    anio INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    pagado TINYINT(1) DEFAULT 0,
    fecha_pago DATE NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_jugador) REFERENCES jugadores(id_jugador) ON DELETE CASCADE,
    FOREIGN KEY (id_concepto) REFERENCES conceptos_cuota(id_concepto),
    UNIQUE KEY unique_jugador_concepto_anio (id_jugador, id_concepto, anio),
    INDEX idx_jugador (id_jugador),
    INDEX idx_concepto (id_concepto),
    INDEX idx_anio (anio)
);

-- =====================================================
-- 4. TABLA DE CUOTAS MENSUALES DETALLADO
-- =====================================================
CREATE TABLE IF NOT EXISTS cuotas_mensuales_detalle (
    id_cuota_mes INT PRIMARY KEY AUTO_INCREMENT,
    id_jugador INT NOT NULL,
    id_concepto INT NOT NULL,
    mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    anio INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    pagado TINYINT(1) DEFAULT 0,
    fecha_pago TIMESTAMP NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_jugador) REFERENCES jugadores(id_jugador) ON DELETE CASCADE,
    FOREIGN KEY (id_concepto) REFERENCES conceptos_cuota(id_concepto),
    UNIQUE KEY unique_jugador_concepto_mes_anio (id_jugador, id_concepto, mes, anio),
    INDEX idx_jugador (id_jugador),
    INDEX idx_mes_anio (mes, anio),
    INDEX idx_pagado (pagado)
);

-- =====================================================
-- 5. TABLA DE FORMAS DE PAGO
-- =====================================================
CREATE TABLE IF NOT EXISTS formas_pago (
    id_forma_pago INT PRIMARY KEY AUTO_INCREMENT,
    nombre_forma VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activa TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre_forma)
);

-- =====================================================
-- 6. TABLA DE INGRESOS/PAGOS (Transacciones)
-- =====================================================
CREATE TABLE IF NOT EXISTS ingresos (
    id_ingreso INT PRIMARY KEY AUTO_INCREMENT,
    id_jugador INT NOT NULL,
    concepto VARCHAR(100) NOT NULL,
    mes_deuda INT DEFAULT 0,
    fecha_pago DATE NOT NULL,
    id_forma_pago INT NOT NULL,
    divisas DECIMAL(10, 2),
    tasa_cambio DECIMAL(10, 4),
    monto_bsf DECIMAL(10, 2),
    monto_usd DECIMAL(10, 2),
    referencia VARCHAR(100),
    notas TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_jugador) REFERENCES jugadores(id_jugador) ON DELETE CASCADE,
    FOREIGN KEY (id_forma_pago) REFERENCES formas_pago(id_forma_pago),
    INDEX idx_jugador (id_jugador),
    INDEX idx_fecha_pago (fecha_pago),
    INDEX idx_referencia (referencia),
    INDEX idx_forma_pago (id_forma_pago)
);

-- =====================================================
-- DATOS INICIALES - FORMAS DE PAGO
-- =====================================================
INSERT INTO formas_pago (nombre_forma, descripcion) VALUES
('PAGO_MOVIL', 'Pago Móvil'),
('TRANSFERENCIA_BANCARIA', 'Transferencia Bancaria'),
('EFECTIVO', 'Efectivo'),
('CHEQUE', 'Cheque'),
('DEPOSITO', 'Depósito en Banco'),
('OTRO', 'Otra forma de pago');

-- =====================================================
-- DATOS INICIALES - CONCEPTOS DE CUOTA
-- =====================================================
INSERT INTO conceptos_cuota (nombre_concepto, descripcion, tipo) VALUES
('INSCRIPCION', 'Cuota de Inscripción Anual', 'Inscripción'),
('MENSUAL', 'Cuota Mensual', 'Mensual'),
('UNIFORMES', 'Cuota de Uniformes', 'Uniforme'),
('CONMEBOL', 'Cuota CONMEBOL', 'Torneo'),
('MUNICIPAL_AP', 'Cuota Municipal AP', 'Torneo'),
('MUNICIPAL_CL', 'Cuota Municipal CL', 'Torneo');

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Estado de Cuenta por Jugador
CREATE OR REPLACE VIEW v_estado_cuenta_jugador AS
SELECT 
    j.id_jugador,
    j.cedula,
    j.nombre_apellido,
    j.categoria,
    j.status,
    j.torneo,
    j.anio_ingreso,
    j.deuda_2025,
    SUM(CASE WHEN cc.pagado = 0 THEN cc.monto ELSE 0 END) as total_concepto_pendiente,
    SUM(CASE WHEN cmd.pagado = 0 THEN cmd.monto ELSE 0 END) as total_mensual_pendiente,
    (COALESCE(j.deuda_2025, 0) + 
     COALESCE(SUM(CASE WHEN cc.pagado = 0 THEN cc.monto ELSE 0 END), 0) +
     COALESCE(SUM(CASE WHEN cmd.pagado = 0 THEN cmd.monto ELSE 0 END), 0)) as saldo_total
FROM jugadores j
LEFT JOIN cuotas_conceptos cc ON j.id_jugador = cc.id_jugador
LEFT JOIN cuotas_mensuales_detalle cmd ON j.id_jugador = cmd.id_jugador
GROUP BY j.id_jugador, j.cedula, j.nombre_apellido, j.categoria, j.status, j.torneo, j.anio_ingreso, j.deuda_2025;

-- Vista: Ingresos Registrados
CREATE OR REPLACE VIEW v_ingresos_detallado AS
SELECT 
    i.id_ingreso,
    j.cedula,
    j.nombre_apellido,
    j.categoria,
    i.concepto,
    i.mes_deuda,
    i.fecha_pago,
    fp.nombre_forma,
    i.divisas,
    i.tasa_cambio,
    i.monto_bsf,
    i.monto_usd,
    i.referencia,
    i.fecha_registro
FROM ingresos i
JOIN jugadores j ON i.id_jugador = j.id_jugador
JOIN formas_pago fp ON i.id_forma_pago = fp.id_forma_pago
ORDER BY i.fecha_pago DESC;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento: Obtener Estado de Cuenta de un Jugador
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_estado_cuenta_jugador(
    IN p_id_jugador INT
)
BEGIN
    SELECT * FROM v_estado_cuenta_jugador 
    WHERE id_jugador = p_id_jugador;
END$$
DELIMITER ;

-- Procedimiento: Registrar Ingreso/Pago
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_registrar_ingreso(
    IN p_cedula VARCHAR(20),
    IN p_concepto VARCHAR(100),
    IN p_mes_deuda INT,
    IN p_fecha_pago DATE,
    IN p_forma_pago VARCHAR(100),
    IN p_divisas DECIMAL(10,2),
    IN p_tasa_cambio DECIMAL(10,4),
    IN p_monto_bsf DECIMAL(10,2),
    IN p_monto_usd DECIMAL(10,2),
    IN p_referencia VARCHAR(100)
)
BEGIN
    DECLARE p_id_jugador INT;
    DECLARE p_id_forma_pago INT;
    
    -- Obtener ID del jugador
    SELECT id_jugador INTO p_id_jugador FROM jugadores WHERE cedula = p_cedula;
    
    IF p_id_jugador IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Jugador no encontrado';
    END IF;
    
    -- Obtener ID de la forma de pago
    SELECT id_forma_pago INTO p_id_forma_pago FROM formas_pago WHERE nombre_forma = p_forma_pago;
    
    IF p_id_forma_pago IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Forma de pago no válida';
    END IF;
    
    -- Registrar el ingreso
    INSERT INTO ingresos (
        id_jugador, concepto, mes_deuda, fecha_pago, 
        id_forma_pago, divisas, tasa_cambio, monto_bsf, monto_usd, referencia
    ) VALUES (
        p_id_jugador, p_concepto, p_mes_deuda, p_fecha_pago,
        p_id_forma_pago, p_divisas, p_tasa_cambio, p_monto_bsf, p_monto_usd, p_referencia
    );
END$$
DELIMITER ;

-- Procedimiento: Insertar Jugador
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_insertar_jugador(
    IN p_cedula VARCHAR(20),
    IN p_nombre_apellido VARCHAR(150),
    IN p_categoria VARCHAR(50),
    IN p_status VARCHAR(50),
    IN p_mes_ingreso VARCHAR(10),
    IN p_torneo VARCHAR(100),
    IN p_anio_ingreso INT,
    IN p_deuda_2025 DECIMAL(10,2)
)
BEGIN
    INSERT INTO jugadores (
        cedula, nombre_apellido, categoria, status, 
        mes_ingreso, torneo, anio_ingreso, deuda_2025
    ) VALUES (
        p_cedula, p_nombre_apellido, p_categoria, p_status,
        p_mes_ingreso, p_torneo, p_anio_ingreso, p_deuda_2025
    );
    
    SELECT LAST_INSERT_ID() as id_jugador;
END$$
DELIMITER ;

-- Procedimiento: Actualizar Jugador
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_actualizar_jugador(
    IN p_id_jugador INT,
    IN p_nombre_apellido VARCHAR(150),
    IN p_categoria VARCHAR(50),
    IN p_status VARCHAR(50),
    IN p_fecha_egreso DATE
)
BEGIN
    UPDATE jugadores 
    SET 
        nombre_apellido = COALESCE(p_nombre_apellido, nombre_apellido),
        categoria = COALESCE(p_categoria, categoria),
        status = COALESCE(p_status, status),
        fecha_egreso = COALESCE(p_fecha_egreso, fecha_egreso)
    WHERE id_jugador = p_id_jugador;
END$$
DELIMITER ;

-- =====================================================
-- CONSULTAS ÚTILES (Ejemplos de CRUD)
-- =====================================================

/*
-- CREATE: Insertar un nuevo jugador
INSERT INTO jugadores (cedula, nombre_apellido, categoria, status, mes_ingreso, torneo, anio_ingreso, deuda_2025)
VALUES ('34380660', 'ISAAC GABRIEL VARGAS NUÑEZ', 'SUB-15', 'Nuevo Ingreso', 'ene-26', 'CANTERITAS', 2014, 0);

-- READ: Obtener todos los jugadores activos
SELECT * FROM jugadores WHERE status = 'Activo' ORDER BY nombre_apellido;

-- READ: Obtener estado de cuenta completo
SELECT * FROM v_estado_cuenta_jugador WHERE cedula = '34380660';

-- READ: Obtener ingresos de un jugador por rango de fechas
SELECT * FROM v_ingresos_detallado 
WHERE cedula = '34380660' 
AND fecha_pago BETWEEN '2026-01-01' AND '2026-12-31';

-- UPDATE: Actualizar estado del jugador
UPDATE jugadores SET status = 'Activo' WHERE id_jugador = 1;

-- UPDATE: Registrar fecha de egreso
UPDATE jugadores SET fecha_egreso = '2026-05-29', status = 'Inactivo' WHERE id_jugador = 1;

-- DELETE: Eliminar un jugador (cascada)
DELETE FROM jugadores WHERE id_jugador = 1;

-- Insertar cuota mensual
INSERT INTO cuotas_mensuales_detalle (id_jugador, id_concepto, mes, anio, monto)
VALUES (1, 2, 1, 2026, 150);

-- Registrar pago
INSERT INTO ingresos (id_jugador, concepto, mes_deuda, fecha_pago, id_forma_pago, divisas, tasa_cambio, monto_bsf, monto_usd, referencia)
VALUES (1, 'MENSUAL', 1, '2026-01-15', 1, 45, 39.5076, 1777.9, 195798, '17786.7');

-- Marcar cuota como pagada
UPDATE cuotas_mensuales_detalle SET pagado = 1, fecha_pago = NOW() 
WHERE id_jugador = 1 AND mes = 1 AND anio = 2026 AND id_concepto = 2;
*/

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================
