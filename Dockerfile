FROM node:8.2.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
RUN npm test

COPY . /usr/src/app

ENV NODE_ENV=dev

CMD [ "npm", "start" ]
