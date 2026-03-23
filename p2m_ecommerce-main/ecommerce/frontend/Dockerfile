# Utiliser la version 22 de Node.js (requise par votre version de Vite)
FROM node:22-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de configuration npm et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le reste du code du frontend
COPY . .

# Exposer le port de Vite (généralement 5173)
EXPOSE 5173

# Démarrer le serveur de développement
CMD ["npm", "run", "dev", "--", "--host"]