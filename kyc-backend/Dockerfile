FROM node:22-slim

# Instalar wrangler globalmente para la emulación
RUN npm install -g wrangler

WORKDIR /app

# Copiar e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código del backend
COPY . .

# Validar tipos
RUN npx tsc --noEmit

# Exponer el puerto emulado de la API
EXPOSE 8787

# Aplicar migraciones localmente y ejecutar el Worker en modo local dentro de la red del contenedor
CMD ["sh", "-c", "npx wrangler d1 migrations apply kyc-db --local && npx wrangler dev --ip 0.0.0.0 --port 8787"]
