FROM node:18

ARG DATABASE_ENDPOINT

WORKDIR /usr/src/app

COPY package*.json ./

ENV DATABASE_ENDPOINT=$DATABASE_ENDPOINT

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]