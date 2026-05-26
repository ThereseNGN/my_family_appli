# Étape 1 : Construction (Build) de l'application Vite
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur web Nginx pour la production
FROM nginx:alpine
# On copie les fichiers compilés par Vite (qui sont dans /dist) vers le dossier public de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# On expose le port standard du web
EXPOSE 80
# Lancement de Nginx
CMD ["nginx", "-g", "daemon off;"]