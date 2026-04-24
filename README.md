# 🏛 Trámites Digitales

![CI](https://github.com/AlexST360/tramites-digitales/actions/workflows/ci.yml/badge.svg)
![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)
![NestJS](https://img.shields.io/badge/NestJS-11-red?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-persistente-lightblue?logo=sqlite)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)
![Docker](https://img.shields.io/badge/Docker-compose-blue?logo=docker)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema web fullstack para la **gestión y digitalización de trámites municipales**. Permite registrar, consultar, filtrar, editar y hacer seguimiento de solicitudes ciudadanas (certificados, permisos, licencias, registros) con un flujo de estados claro y una interfaz profesional.

---

## ¿Qué hace esta aplicación?

Imagina una municipalidad donde los ciudadanos hacen solicitudes en papel y los funcionarios las pierden, olvidan o no saben en qué estado están. Este sistema digitaliza ese proceso:

- Un ciudadano solicita un trámite (certificado de residencia, permiso de obras, etc.)
- El operador lo registra en el sistema con todos sus datos
- El trámite pasa por estados: **Pendiente → En Proceso → Completado** (o Rechazado)
- En cualquier momento se puede consultar quién lo solicitó, cuándo, y en qué estado está
- Se pueden exportar reportes en PDF con un clic
- Todo queda guardado en una base de datos real que persiste entre sesiones

---

## ✨ Funcionalidades

### 🔐 Autenticación con JWT
Acceso protegido con usuario y contraseña. El sistema genera un token JWT que se envía automáticamente en cada petición al API. Las rutas del frontend y los endpoints del backend están completamente protegidos.

### 📊 Dashboard con métricas en tiempo real
Pantalla principal con tarjetas que muestran el total de trámites por estado (pendientes, en proceso, completados, rechazados) y un **gráfico de dona interactivo** (Chart.js) con la distribución porcentual.

### 📋 Gestión completa de trámites (CRUD)
- Crear, editar y eliminar trámites
- Cada trámite tiene: título, tipo, solicitante, fecha y estado
- Vista de detalle individual con flujo de estado visual
- Confirmación antes de eliminar

### 🔍 Filtros avanzados combinados
Filtra la lista por **estado**, **tipo**, **rango de fechas** (desde/hasta) y **búsqueda libre** por título o nombre del solicitante — todo al mismo tiempo y en tiempo real.

### 📄 Exportar a PDF
Genera un reporte PDF profesional con los trámites que están actualmente en pantalla (respeta los filtros aplicados). Incluye encabezado, fecha de generación, total de registros y tabla formateada con colores alternos.

### 📑 Paginación
La lista muestra 10 trámites por página con controles de navegación (anterior, siguiente, páginas numeradas). El backend aplica la paginación directamente en la consulta SQL.

### 🌙 Modo oscuro
Toggle en el sidebar que cambia toda la interfaz a modo oscuro. La preferencia se guarda en localStorage y persiste entre sesiones.

### 🔔 Notificaciones toast
Mensajes animados de éxito, error y advertencia que aparecen en la esquina inferior derecha en cada acción (crear, editar, eliminar, exportar, errores de conexión).

### 👁 Vista de detalle
Página individual por trámite con toda la información, fechas de creación/modificación del sistema y un flujo visual que muestra en qué etapa está el trámite.

### 📖 Swagger UI — API interactiva
Documentación automática del API disponible en `/api/docs`. Permite probar todos los endpoints directamente desde el navegador sin necesidad de Postman.

---

## 🛠 Stack tecnológico

### Frontend — Angular 21
- **Signals** (`signal`, `computed`, `toSignal`) — reactividad moderna sin zone.js
- **Lazy loading** — cada página se carga solo cuando se necesita
- **Standalone components** — arquitectura modular sin NgModules
- **JWT Interceptor** — agrega el token automáticamente a todas las peticiones HTTP
- **Chart.js** — gráfico de dona con actualización reactiva
- **jsPDF + jspdf-autotable** — generación de PDF en el navegador
- **SCSS + CSS Variables** — design system con soporte de dark mode nativo

### Backend — NestJS 11
- **TypeORM + SQLite** — ORM con base de datos persistente en archivo local
- **Passport + JWT** — autenticación stateless con tokens seguros (24h de expiración)
- **class-validator** — validación automática de todos los DTOs
- **@nestjs/swagger** — documentación OpenAPI 3.0 generada desde el código
- **Guards y Decoradores** — protección de endpoints con `JwtAuthGuard`
- **Query Builder** — filtros y paginación aplicados directamente en SQL

### DevOps
- **Docker + Docker Compose** — stack completo en contenedores con multi-stage build
- **Nginx** — sirve el frontend y hace proxy inverso al backend
- **GitHub Actions** — CI que valida los builds de frontend, backend y Docker en cada push

---

## 🚀 Inicio rápido

### Opción A — Docker (recomendado)

```bash
git clone https://github.com/AlexST360/tramites-digitales.git
cd tramites-digitales
docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost |
| API | http://localhost:3000/api |
| Swagger | http://localhost:3000/api/docs |

---

### Opción B — Local

**Prerequisitos:** Node.js 20+, Angular CLI, NestJS CLI

```bash
git clone https://github.com/AlexST360/tramites-digitales.git
cd tramites-digitales

# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install
```

**Terminal 1 — Backend**
```bash
cd backend
npm run start:dev
# API:    http://localhost:3000/api
# Swagger: http://localhost:3000/api/docs
```

**Terminal 2 — Frontend**
```bash
cd frontend
ng serve
# App: http://localhost:4200
```

**Credenciales de acceso:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## 🔌 API Endpoints

Todos los endpoints requieren `Authorization: Bearer <token>` excepto `/api/auth/login`.

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión — devuelve JWT |
| `GET` | `/api/tramites` | Listar con filtros y paginación |
| `GET` | `/api/tramites/stats` | Estadísticas por estado |
| `GET` | `/api/tramites/:id` | Obtener trámite por ID |
| `POST` | `/api/tramites` | Crear nuevo trámite |
| `PATCH` | `/api/tramites/:id` | Actualizar trámite |
| `DELETE` | `/api/tramites/:id` | Eliminar trámite |

**Query params en `GET /api/tramites`:**

| Param | Tipo | Ejemplo |
|---|---|---|
| `estado` | string | `pendiente`, `en_proceso`, `completado`, `rechazado` |
| `tipo` | string | `Certificado`, `Permiso`, `Licencia`, `Registro` |
| `fechaDesde` | date | `2026-01-01` |
| `fechaHasta` | date | `2026-12-31` |
| `page` | number | `1` |
| `limit` | number | `10` |

---

## 🏗 Estructura del proyecto

```
tramites-digitales/
├── .github/workflows/ci.yml       # GitHub Actions CI
├── backend/                       # NestJS API REST
│   ├── src/
│   │   ├── auth/                  # JWT, Passport, Guards
│   │   │   ├── strategies/
│   │   │   ├── guards/
│   │   │   └── dto/
│   │   └── tramites/              # CRUD completo
│   │       ├── dto/               # Validación con class-validator
│   │       └── entities/          # TypeORM + SQLite
│   └── Dockerfile
├── frontend/                      # Angular 21
│   ├── src/app/
│   │   ├── auth/                  # Guard, Interceptor, Service
│   │   ├── components/toast/      # Notificaciones globales
│   │   ├── pages/
│   │   │   ├── dashboard/         # Métricas + Chart.js
│   │   │   ├── login/             # Autenticación
│   │   │   ├── tramites-list/     # Filtros + Paginación + PDF
│   │   │   ├── tramite-form/      # Crear / Editar
│   │   │   └── tramite-detail/    # Vista de detalle
│   │   └── services/              # HTTP + Toast
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

## 📝 Licencia

MIT © 2026 — [AlexST360](https://github.com/AlexST360)
