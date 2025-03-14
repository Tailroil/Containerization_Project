#  Étape 1 : Utiliser une image Node.js avec npm préinstallé
FROM node:18-alpine

#  Étape 2 : Définir le dossier de travail dans le conteneur
WORKDIR /app

#  Étape 3 : Copier les fichiers de configuration
COPY package.json package-lock.json ./

#  Étape 4 : Installer les dépendances
RUN npm install

#  Étape 5 : Copier tout le code source
COPY . .

#  Étape 6 : Compiler TypeScript en JavaScript
RUN npm run build

#  Étape 7 : Exposer le port sur lequel l'application tourne
EXPOSE 5000

#  Étape 8 : Démarrer l'application
CMD ["npm", "start"]
