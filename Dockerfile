FROM node:14.20.1-alpine

RUN mkdir -p /usr/app/storage_node

WORKDIR /usr/app/storage_node

COPY package*.json .

COPY tsconfig.json .

RUN npm install