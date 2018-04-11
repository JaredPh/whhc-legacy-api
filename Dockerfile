FROM node:8.11

RUN mkdir -p /usr/local/app
WORKDIR /usr/local/app

COPY . .

RUN npm install -g @types/node typescript  --silent
RUN npm install --silent

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]