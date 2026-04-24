# 🏛 Trámites Digitales

![CI](https://github.com/TU_USUARIO/tramites-digitales/actions/workflows/ci.yml/badge.svg)
![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)
![NestJS](https://img.shields.io/badge/NestJS-11-red?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema de digitalización de trámites municipales construido con **Angular 21** (signals, zoneless) y **NestJS 11** (REST API, Swagger).

---

## ✨ Features

| Feature | Descripción |
|---|---|
| 📊 **Dashboard** | Métricas en tiempo real con gráfico de dona (Chart.js) |
| 📋 **CRUD completo** | Crear, listar, editar y eliminar trámites |
| 🔍 **Filtros avanzados** | Por estado, tipo, rango de fechas y búsqueda libre |
| ✅ **Validación** | DTOs validados con `class-validator` en el backend |
| 📖 **Swagger UI** | Documentación interactiva en `/api/docs` |
| 🐳 **Docker** | Stack completo con `docker compose up` |
| ⚡ **CI/CD** | GitHub Actions valida builds en cada push |
| 🚀 **Angular 21 Signals** | Reactividad sin zone.js con `signal`, `computed`, `toSignal` |

---

## 🖼 Screenshots

> Dashboard con métricas y gráfico de dona

![Dashboard](docs/screenshot-dashboard.png)

> Lista de trámites con filtros avanzados

![Lista](docs/screenshot-lista.png)

> Swagger UI — documentación interactiva del API

![Swagger](docs/screenshot-swagger.png)

---

## 🚀 Inicio rápido

### Opción A — Docker (recomendado)

```bash
git clone https://github.com/TU_USUARIO/tramites-digitales.git
cd tramites-digitales
docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:3000/api
- Swagger UI: http://localhost:3000/api/docs

---

### Opción B — Local

**Prerequisitos:** Node.js 20+, Angular CLI, NestJS CLI

```bash
# Clonar
git clone https://github.com/TU_USUARIO/tramites-digitales.git
cd tramites-digitales

# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install
```

**Terminal 1 — Backend**
```bash
cd backend
npm run start:dev
# API en http://localhost:3000/api
# Swagger en http://localhost:3000/api/docs
```

**Terminal 2 — Frontend**
```bash
cd frontend
ng serve
# App en http://localhost:4200
```

---

## 🏗 Estructura del proyecto

```
tramites-digitales/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI
├── backend/                    # NestJS API REST
│   ├── src/
│   │   ├── tramites/
│   │   │   ├── dto/            # class-validator + Swagger
│   │   │   ├── entities/
│   │   │   ├── tramites.controller.ts
│   │   │   └── tramites.service.ts
│   │   └── main.ts             # Swagger + ValidationPipe + CORS
│   └── Dockerfile
├── frontend/                   # Angular 21 Standalone
│   ├── src/app/
│   │   ├── pages/
│   │   │   ├── dashboard/      # Chart.js + métricas
│   │   │   ├── tramites-list/  # Filtros avanzados
│   │   │   └── tramite-form/   # Crear / Editar
│   │   └── services/
│   │       └── tramites.ts     # HttpClient + interfaces
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/tramites` | Listar con filtros opcionales |
| `GET` | `/api/tramites/stats` | Estadísticas por estado |
| `GET` | `/api/tramites/:id` | Obtener por ID |
| `POST` | `/api/tramites` | Crear nuevo trámite |
| `PATCH` | `/api/tramites/:id` | Actualizar trámite |
| `DELETE` | `/api/tramites/:id` | Eliminar trámite |

**Query params disponibles en `GET /api/tramites`:**
- `estado` — `pendiente | en_proceso | completado | rechazado`
- `tipo` — `Certificado | Permiso | Licencia | Registro | Otro`
- `fechaDesde` — formato `YYYY-MM-DD`
- `fechaHasta` — formato `YYYY-MM-DD`

---

## 🛠 Stack tecnológico

**Frontend**
- Angular 21 — Standalone components, Signals, zoneless
- Chart.js 4 — Gráfico de dona interactivo
- Angular Router — Lazy loading

**Backend**
- NestJS 11 — Arquitectura modular
- class-validator — Validación de DTOs
- @nestjs/swagger — Documentación OpenAPI 3.0

**DevOps**
- Docker + Docker Compose — Contenedores multi-stage
- GitHub Actions — CI automático en push/PR
- Nginx — Servidor estático + reverse proxy

---

## 📝 Licencia

MIT © 2026
