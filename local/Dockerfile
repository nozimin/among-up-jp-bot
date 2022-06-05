FROM node:16-alpine
WORKDIR /usr/src/app

COPY package.json \
     yarn.lock \
     /usr/src/app/

RUN apk update && \
    apk add --no-cache git

RUN yarn install --frozen-lockfile
