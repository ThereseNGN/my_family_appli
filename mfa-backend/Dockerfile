# 1. Image de base officielle Node.js
FROM node:20-alpine
# 2. On se place dans le dossier de travail du conteneur
WORKDIR /app
# 3. On copie les fichiers de configuration npm
COPY package*.json ./
# 4. On installe les dépendances
RUN npm install
# 5. On copie tout le reste du code source
COPY . .
# 6. On expose le port sur lequel le serveur écoute
EXPOSE 5000
# 7. La commande pour démarrer l'application
CMD ["node", "server.js"]