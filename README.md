# Plataforma KYC (Know Your Customer) - Guía de Producción y Despliegue

Este repositorio contiene una mini-plataforma de KYC modularizada, construida con arquitectura limpia y optimizada para el Edge de Cloudflare. El sistema se compone de un **Backend** REST API autodocumentado con Swagger expuesto en Cloudflare Workers y D1, y un **Frontend** SPA en React empaquetado en Cloudflare Pages.

---

## 🛠️ Estructura del Proyecto

* **`/kyc-backend`**: API Hono.js + TypeScript en Cloudflare Workers (con su propio `Dockerfile` y `.env.template`).
* **`/kyc-frontend`**: Interfaz de usuario SPA construida en React + Vite + TailwindCSS v4 (con su propio `Dockerfile` y `.env.template`).
* **`docker-compose.yml`**: Orquestador local en la raíz del proyecto para construir y comunicar ambos servicios.
* **`.env.template`**: Archivo de plantilla en la raíz para configurar Docker Compose sin variables hardcodeadas.

---

## ⚙️ Variables de Entorno y Configuración

El proyecto está diseñado para evitar la persistencia de variables de entorno *hardcoded* (acopladas al código). Todas las configuraciones críticas se inyectan a través de archivos `.env`.

### 1. Plantilla de Docker Compose (`/.env.template`)
Copia esta plantilla a un archivo `.env` en la raíz para configurar los contenedores:
```env
BACKEND_PORT=8787       # Puerto expuesto para el backend Hono
FRONTEND_PORT=8080      # Puerto expuesto para el frontend React/Nginx
NODE_ENV=development    # Entorno global
CORS_ORIGIN=http://localhost:8080
VITE_API_URL=http://localhost:8787
```

### 2. Backend (`/kyc-backend/.env.template`)
Configuraciones locales para el simulador del Worker:
```env
PORT=8787
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Frontend (`/kyc-frontend/.env.template`)
Configuración de la dirección del servicio API:
```env
VITE_API_URL=http://localhost:8787
```

---

## 🐳 Orquestación Local con Docker Compose

Para compilar y levantar de forma local toda la plataforma KYC en contenedores:

1. **Crear archivo de entorno raíz:**
   ```bash
   cp .env.template .env
   ```
2. **Levantar contenedores con Docker Compose:**
   ```bash
   docker-compose up --build
   ```
3. **Acceder a los servicios:**
   * **Frontend (React compilado en Nginx):** `http://localhost:8080`
   * **Backend (Worker emulado en Wrangler):** `http://localhost:8787`
   * **Documentación Swagger:** `http://localhost:8787/swagger`

---

## 🚀 Guía de Despliegue en Producción (Cloudflare)

Sigue estos pasos para desplegar toda la infraestructura en la nube de Cloudflare utilizando la CLI oficial `wrangler`.

### Paso 1: Autenticación en Cloudflare
Asegúrate de estar autenticado en tu cuenta de Cloudflare:
```bash
npx wrangler login
```

### Paso 2: Crear y Desplegar la Base de Datos D1
1. **Crear la base de datos remota:**
   ```bash
   npx wrangler d1 create kyc-db
   ```
   *Copia el `database_id` (UUID) devuelto por la consola.*

2. **Configurar `wrangler.toml`:**
   Abre [kyc-backend/wrangler.toml](file:///c:/Users/antho/OneDrive/Documentos/freecode/kyc-backend/wrangler.toml) y actualiza el campo `database_id` con el UUID que acabas de copiar:
   ```toml
   database_id = "tu-database-id-de-produccion-aqui"
   ```

3. **Ejecutar migraciones en producción:**
   Aplica la estructura SQL inicial a la base de datos remota:
   ```bash
   cd kyc-backend
   npx wrangler d1 migrations apply kyc-db --remote
   ```

### Paso 3: Desplegar el Backend (Workers)
1. **Compilar y publicar el Worker:**
   ```bash
   npx wrangler deploy
   ```
   *Copia la URL pública generada (ej. `https://kyc-backend.<tu-usuario>.workers.dev`).*

### Paso 4: Desplegar el Frontend (Pages)
1. **Crear archivo `.env` del Frontend:**
   Ve al directorio `kyc-frontend` y crea un archivo `.env` configurando la API URL con la URL de tu Worker:
   ```env
   VITE_API_URL=https://kyc-backend.<tu-usuario>.workers.dev
   ```

2. **Compilar y publicar en Cloudflare Pages:**
   ```bash
   cd ../kyc-frontend
   npm install
   npm run build
   npx wrangler pages deploy dist --project-name=kyc-frontend
   ```

3. **Actualizar CORS:**
   Copia el dominio asignado por Cloudflare Pages, vuelve a [kyc-backend/wrangler.toml](file:///c:/Users/antho/OneDrive/Documentos/freecode/kyc-backend/wrangler.toml) y actualiza la variable `CORS_ORIGIN`. Despliega el Worker nuevamente con `npx wrangler deploy` para autorizar las solicitudes.
