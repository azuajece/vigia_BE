# El Vigía FC - API de Gestión de Jugadores y Cuotas

API RESTful completa para la gestión de jugadores, cuotas, pagos e ingresos del club de fútbol "El Vigía FC".

## 🚀 Características

- ✅ **Gestión de Jugadores**: CRUD completo con búsqueda por cédula, categoría y estado
- ✅ **Conceptos de Cuota**: Administración de tipos de cuotas (Inscripción, Mensual, Uniforme, etc.)
- ✅ **Cuotas por Concepto**: Gestión de cuotas anuales por concepto
- ✅ **Cuotas Mensuales**: Detalles de cuotas mensuales con seguimiento de pagos
- ✅ **Formas de Pago**: Configuración de métodos de pago disponibles
- ✅ **Ingresos/Pagos**: Registro de transacciones con múltiples divisas
- ✅ **Estado de Cuenta**: Consulta del estado de cuenta completo por jugador
- ✅ **Documentación Swagger**: API completamente documentada

## 🛠️ Stack Tecnológico

- **NestJS 11.1.0**: Framework moderno y escalable para Node.js
- **Prisma 7.0.0**: ORM type-safe con migraciones automáticas
- **SQLite**: Base de datos ligera (perfecto para desarrollo)
- **Swagger/OpenAPI**: Documentación interactiva de la API
- **TypeScript 5.6.3**: Tipado estático para mayor seguridad
- **Jest 30.0**: Testing framework moderno
- **Class Validator**: Validación de DTOs

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🚀 Instalación

1. **Clonar o descargar el proyecto**
```bash
cd vigia
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# El archivo .env ya está configurado para SQLite
# DATABASE_URL="file:./vigia.db"
```

4. **Generar cliente de Prisma**
```bash
npm run prisma:generate
```

5. **Ejecutar migraciones**
```bash
npm run prisma:migrate
```

6. **Poblar base de datos con datos iniciales (opcional)**
```bash
npm run prisma:seed
```

7. **Iniciar el servidor**
```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Documentación de la API

Una vez que el servidor esté corriendo, accede a la documentación interactiva:

**Swagger UI**: http://localhost:3000/docs

## 📁 Estructura del Proyecto

```
src/
├── common/
│   └── prisma/              # Servicio y módulo de Prisma
├── modules/
│   ├── jugadores/           # Módulo de jugadores
│   ├── conceptos-cuota/      # Módulo de conceptos de cuota
│   ├── cuotas-conceptos/     # Módulo de cuotas anuales
│   ├── cuotas-mensuales/     # Módulo de cuotas mensuales
│   ├── formas-pago/          # Módulo de formas de pago
│   └── ingresos/             # Módulo de ingresos/pagos
├── app.module.ts            # Módulo principal
└── main.ts                  # Punto de entrada

prisma/
├── schema.prisma            # Esquema de base de datos
└── seed.ts                  # Script de población de datos
```

## 🏗️ Arquitectura

Cada módulo sigue una estructura limpia y desacoplada:

```
modulo/
├── controllers/             # Manejo de peticiones HTTP
├── services/                # Lógica de negocio
├── dto/                     # Data Transfer Objects
├── mapper/                  # Mapeo entre entidades y DTOs
└── modulo.module.ts         # Configuración del módulo
```

## 🔑 DTOs y Validación

Todos los endpoints tienen validación automática mediante `class-validator`:

- Tipos de datos validados
- Longitud de campos
- Valores requeridos vs opcionales
- Enumeraciones

## 🗄️ Base de Datos

### Tablas Principales

- **jugadores**: Información de jugadores
- **conceptos_cuota**: Tipos de conceptos de cuota
- **cuotas_conceptos**: Cuotas anuales por concepto
- **cuotas_mensuales_detalle**: Detalles mensuales de cuotas
- **formas_pago**: Métodos de pago disponibles
- **ingresos**: Registro de transacciones

### Migraciones

```bash
# Crear nueva migración después de cambios en schema.prisma
npm run prisma:migrate

# Ver cambios pendientes
npm run prisma:migrate -- --dry-run

# Visualizar la base de datos en UI interactiva
npm run prisma:studio
```

## 📊 Ejemplos de Uso

### Crear un Jugador
```bash
POST /api/v1/jugadores
Content-Type: application/json

{
  "cedula": "27555111",
  "nombre_apellido": "Carlos García López",
  "categoria": "SUB-17",
  "status": "ACTIVO",
  "mes_ingreso": "Febrero",
  "torneo": "Liga Interna",
  "anio_ingreso": 2024
}
```

### Obtener Estado de Cuenta
```bash
GET /api/v1/jugadores/1/estado-cuenta
```

### Registrar Ingreso/Pago
```bash
POST /api/v1/ingresos
Content-Type: application/json

{
  "id_jugador": 1,
  "concepto": "INSCRIPCION",
  "fecha_pago": "2024-06-01",
  "id_forma_pago": 1,
  "monto_bsf": 1500,
  "referencia": "PM123456"
}
```

## 🔍 Búsquedas Disponibles

### Jugadores
- `GET /api/v1/jugadores` - Listar todos
- `GET /api/v1/jugadores/cedula/:cedula` - Por cédula
- `GET /api/v1/jugadores/id/:id` - Por ID
- `GET /api/v1/jugadores/categoria/:categoria` - Por categoría
- `GET /api/v1/jugadores/status/:status` - Por estado
- `GET /api/v1/jugadores/:id/estado-cuenta` - Estado de cuenta

### Cuotas
- `GET /api/v1/cuotas-conceptos/pendientes/list` - Pendientes de pago
- `GET /api/v1/cuotas-mensuales/jugador/:id_jugador` - Por jugador
- `GET /api/v1/cuotas-mensuales/anio/:anio` - Por año

### Ingresos
- `GET /api/v1/ingresos/jugador/:id_jugador` - Por jugador
- `GET /api/v1/ingresos/referencia/:referencia` - Por referencia
- `GET /api/v1/ingresos/forma-pago/:id_forma_pago` - Por forma de pago
- `GET /api/v1/ingresos/totales/:id_jugador` - Totales por jugador

## 🧪 Testing

```bash
# Ejecutar pruebas unitarias
npm run test

# Modo watch
npm run test:watch

# Coverage
npm run test:cov

# E2E testing
npm run test:e2e
```

## 🌐 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string de base de datos | `file:./vigia.db` |
| `NODE_ENV` | Ambiente (development/production) | `development` |
| `API_PORT` | Puerto de la API | `3000` |
| `API_PREFIX` | Prefijo de rutas | `api/v1` |

## 🚀 Deployment

### Cambiar a PostgreSQL (Producción)

1. **Actualizar `prisma/schema.prisma`**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Actualizar `.env`**:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/vigia_fc"
```

3. **Ejecutar migraciones**:
```bash
npm run prisma:migrate:prod
```

4. **Construir para producción**:
```bash
npm run build
npm run start:prod
```

## 📝 Licencia

MIT

## 👥 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Desarrollado para El Vigía FC** ⚽
