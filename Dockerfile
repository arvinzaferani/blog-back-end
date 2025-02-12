FROM node:18-alpine3.18.
WORKDIR /app
COPY public/ /app/public
COPY src/ /app/src
COPY package.json /apps/
