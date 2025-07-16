FROM node:22.17

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install --quiet --no-optional --no-fund --loglevel=error

COPY . .

RUN npm run build

EXPOSE 3000
