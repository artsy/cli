FROM node:17

WORKDIR /usr/src/app

RUN apt-get update -y && \
    apt-get install -y python

COPY package.json ./

RUN npm install

COPY . .

ENTRYPOINT ["/usr/src/app/bin/run"]