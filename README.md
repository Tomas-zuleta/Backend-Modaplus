# ModaPlus Backend

API REST completa para el sistema de gestión de moda ModaPlus.

## Características

- Autenticación JWT con refresh tokens
- Encriptación de contraseñas con bcrypt
- Validación de datos con Zod
- Control de permisos basado en roles
- Manejo de errores centralizado
- Rate limiting
- Base de datos SQLite con Prisma

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
cd backend
npm install
```

## Configuración

El archivo `.env` ya está configurado con valores por defecto para desarrollo:

```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
CORS_ORIGIN=http://localhost:5173
```

## Base de datos

```bash
# Generar cliente Prisma
npm run prisma:generate

# Crear tablas
npm run prisma:push

# Poblar con datos iniciales
npm run prisma:seed
```

## Ejecutar

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm run build
npm start
```

## Credenciales por defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin@modaplus.co | admin123 | Superadministrador |

## Estructura del proyecto

```
backend/
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos iniciales
├── src/
│   ├── config/          # Configuraciones (env, database)
│   ├── controllers/     # Manejadores de requests
│   ├── services/        # Lógica de negocio
│   ├── routes/          # Definición de rutas
│   ├── middlewares/     # Auth, validación, errores
│   ├── validators/      # Esquemas Zod
│   ├── utils/           # Helpers (JWT, bcrypt, etc.)
│   ├── errors/          # Clases de error personalizadas
│   ├── app.ts           # Configuración de Express
│   └── server.ts        # Punto de entrada
├── tests/               # Pruebas unitarias
└── package.json
```

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrar usuario |
| GET | /api/usuarios | Listar usuarios |
| GET | /api/roles | Listar roles |
| GET | /api/catalogo/publico | Catálogo público |
| GET | /api/catalogo/productos | Productos |
| GET | /api/catalogo/categorias | Categorías |
| GET | /api/catalogo/colores | Colores |
| GET | /api/catalogo/tallas | Tallas |
| GET | /api/clientes | Listar clientes |
| POST | /api/ventas | Crear venta |
| GET | /api/ventas | Listar ventas |
| GET | /api/compras | Listar compras |
| GET | /api/proveedores | Listar proveedores |
| GET | /api/devoluciones | Listar devoluciones |
| GET | /api/separe/planes | Planes separe |
| GET | /api/dashboard/metrics | Métricas dashboard |

## Conexión con el frontend

El frontend en Vite corre en `http://localhost:5173` y el backend en `http://localhost:3001`. El CORS ya está configurado para permitir conexiones entre ambos.

Para conectar el frontend con el backend, usa la URL base `http://localhost:3001/api` en tu cliente HTTP.
