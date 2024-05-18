FROM node:21.6-bookworm

# Installs gosu: https://github.com/tianon/gosu
RUN set -eux ; \
    curl -fsSL -o /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/1.17/gosu-$(dpkg --print-architecture | awk -F- '{ print $NF }')" ; \
    chmod 0755 /usr/local/bin/gosu

WORKDIR /app

COPY package* /app/
RUN set -eux ; \
    npm i -g npm ; \
    npm install

COPY index.js /app/

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/gosu"]
CMD ["1001", "node", "/app/index.js"]
