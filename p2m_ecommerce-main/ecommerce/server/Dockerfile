# Utiliser une image Python légère
FROM python:3.11-slim

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier le fichier des dépendances et les installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le reste du code du serveur
COPY . .

# Exposer le port sur lequel le serveur tourne
EXPOSE 8000

# Commande pour démarrer le serveur
CMD ["python", "main.py"]