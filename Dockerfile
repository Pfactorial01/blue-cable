FROM node:alpine

ENV NODE_ENV development

WORKDIR /blue-cable

COPY package*.json .

RUN npm install

COPY . .

CMD ["sleep","infinity"]