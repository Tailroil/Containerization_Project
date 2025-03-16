#builder image alpine
FROM node:16-alpine AS builder

WORKDIR /app

# copy dependances et package
COPY package*.json ./

# installation des packages
RUN npm install

# Copy des fichiers
COPY . .

#compilation app
RUN npm run build

# image de production
FROM node:16-alpine

WORKDIR /app

# copy fichiers compilés
COPY --from=builder /app/dist ./dist

# copy et installation dependances de production
COPY package*.json ./

RUN npm install --only=production

# au cas si besoin du csv en production
# COPY --from=builder /app/data ./data

# port server.ts
EXPOSE 3000

# lancement server
CMD ["node", "dist/routes/server.js"]
