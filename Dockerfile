FROM node:alpine

WORKDIR /app
COPY . .

RUN yarn install

EXPOSE 9000

CMD ["yarn", "serve", "-H", "0.0.0.0"]
