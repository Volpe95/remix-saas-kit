FROM node:16-alpine

ENV DOCKERIZE_VERSION v0.6.1  
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \  
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
COPY . .

RUN yarn install

RUN npx prisma generate

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["sh","/app/docker-entrypoint.sh"]

EXPOSE 3000
