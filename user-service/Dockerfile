#builder image alpine
FROM node:16-alpine AS builder

WORKDIR /app

# copiy des dependances et installation des packages
COPY package*.json ./
RUN npm install

# copy de tous les fichiers
COPY . .

# build du projet
RUN npm run build


FROM node:16-alpine

WORKDIR /app

# copy du build 
COPY --from=builder /app/dist ./dist
# copy des dependances
COPY package*.json ./

# installation depandances de production
RUN npm install --only=production

# port de server.ts
EXPOSE 5000

# demarrer le server 
CMD ["node", "dist/server.js"]
