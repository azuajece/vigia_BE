# 🚀 Quick Start - El Vigía FC API

API desarrollada con **NestJS 11.1**, **Prisma 7** y **TypeScript 5.6**

## Inicio Rápido en 5 pasos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Generar cliente de Prisma
```bash
npm run prisma:generate
```

### 3. Crear base de datos y ejecutar migraciones
```bash
npm run prisma:migrate
```

### 4. Poblar datos iniciales (opcional)
```bash
npm run prisma:seed
```

### 5. Iniciar servidor
```bash
npm run start:dev
```

✅ ¡Listo! Tu API está ejecutándose en `http://localhost:3000`

## Acceder a Documentación

📚 **Swagger**: http://localhost:3000/docs

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Iniciar en modo desarrollo con hot-reload |
| `npm run build` | Compilar TypeScript |
| `npm run start:prod` | Iniciar en modo producción |
| `npm run prisma:studio` | Abrir Prisma Studio (UI para DB) |
| `npm run lint` | Ejecutar ESLint |
| `npm run format` | Formatear código con Prettier |
| `npm run test` | Ejecutar tests |

## Estructura de Rutas

```
GET    /api/v1/jugadores                    # Listar jugadores
POST   /api/v1/jugadores                    # Crear jugador
GET    /api/v1/jugadores/cedula/:cedula     # Por cédula
GET    /api/v1/jugadores/:id                # Por ID
PATCH  /api/v1/jugadores/:id                # Actualizar
DELETE /api/v1/jugadores/:id                # Eliminar
GET    /api/v1/jugadores/:id/estado-cuenta  # Estado de cuenta

GET    /api/v1/conceptos-cuota              # Conceptos
POST   /api/v1/conceptos-cuota              # Crear concepto

GET    /api/v1/cuotas-conceptos             # Cuotas anuales
POST   /api/v1/cuotas-conceptos             # Crear cuota
GET    /api/v1/cuotas-conceptos/pendientes  # Pendientes

GET    /api/v1/cuotas-mensuales             # Cuotas mensuales
POST   /api/v1/cuotas-mensuales             # Crear cuota mensual

GET    /api/v1/formas-pago                  # Formas de pago
POST   /api/v1/formas-pago                  # Crear forma

GET    /api/v1/ingresos                     # Ingresos/Pagos
POST   /api/v1/ingresos                     # Registrar pago
GET    /api/v1/ingresos/jugador/:id         # Por jugador
```

## Ejemplos cURL

### Crear Jugador
```bash
curl -X POST http://localhost:3000/api/v1/jugadores \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "27555111",
    "nombre_apellido": "Carlos García",
    "categoria": "SUB-17",
    "torneo": "Liga Interna",
    "status": "ACTIVO"
  }'
```

### Obtener Estado de Cuenta
```bash
curl http://localhost:3000/api/v1/jugadores/1/estado-cuenta
```

### Registrar Pago
```bash
curl -X POST http://localhost:3000/api/v1/ingresos \
  -H "Content-Type: application/json" \
  -d '{
    "id_jugador": 1,
    "concepto": "INSCRIPCION",
    "fecha_pago": "2024-06-01",
    "id_forma_pago": 1,
    "monto_bsf": 1500,
    "referencia": "PM123456"
  }'
```

## Cambiar a PostgreSQL (Producción)

1. Editar `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Actualizar `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/vigia_fc"
```

3. Ejecutar:
```bash
npm run prisma:migrate:prod
```

## Solución de Problemas

### "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### Error de base de datos
- Eliminar `vigia.db` si existe
- Ejecutar `npm run prisma:migrate`

### Puerto ya en uso
Cambiar `API_PORT` en `.env` a otro puerto (ej: 3001)

---

¿Necesitas más ayuda? Ver README.md para documentación completa.
