# build image alpine
FROM node:18-alpine AS builder

WORKDIR /app

# copy fichiers de dependance
COPY package*.json ./

# installation dependances
RUN npm install

# copy des fichiers
COPY . .

# construction app
RUN npm run build

# image avec nginx
FROM nginx:alpine


#copy des fichiers compilés apres builder
COPY --from=builder /app/dist /usr/share/nginx/html

# port de nginx
EXPOSE 80

# lancement nginx
CMD ["nginx", "-g", "daemon off;"]
