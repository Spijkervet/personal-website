FROM node:alpine

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

EXPOSE 9000

CMD ["yarn", "serve"] 
