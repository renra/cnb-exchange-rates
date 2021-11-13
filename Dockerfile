FROM node:14.18.1

ENV DIR /usr/src/app
RUN mkdir -p ${DIR}
WORKDIR ${DIR}

RUN curl -L -o dumb-init.deb https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_amd64.deb && \
  dpkg -i dumb-init.deb && \
  rm dumb-init.deb

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

RUN npm install -g node-watch typescript sass esbuild

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm install
RUN npm link node-watch

COPY Makefile Makefile
COPY server.js server.js
COPY watcher.js watcher.js

## Any change in the src folder invalidates the cache of this step
##  but the dependencies are still cached
COPY src src
