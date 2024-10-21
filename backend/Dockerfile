FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls -la /usr/src/app/src

RUN ls -la /usr/src/app

RUN pwd

EXPOSE 5000

CMD ["node", "src/server.js"]
