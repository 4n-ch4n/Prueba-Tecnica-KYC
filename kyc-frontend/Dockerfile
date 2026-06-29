# Stage 1: Compilar la aplicación React
FROM node:22-slim AS build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código del frontend
COPY . .

# Argumento para pasar la URL de la API durante la construcción
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compilar para producción
RUN npm run build

# Stage 2: Servir los archivos con Nginx
FROM nginx:alpine

# Copiar los archivos compilados al directorio por defecto de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Sobrescribir la configuración por defecto de Nginx para soportar SPA routing (redirección a index.html)
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

# Exponer el puerto por defecto de Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
