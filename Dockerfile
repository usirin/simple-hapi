FROM node:alpine

COPY package.json /tmp/package.json
RUN cd /tmp && npm install --quiet

RUN mkdir /app && cp -a /tmp/node_modules /app

WORKDIR /app
COPY . /app

RUN pwd && ls -l && which npm

EXPOSE 7070
