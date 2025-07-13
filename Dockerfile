FROM node:22.17
WORKDIR /usr/src/api
COPY . .

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]