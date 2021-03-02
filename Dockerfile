FROM node:12-alpine

LABEL maintainer="romain.decoster@pm.me"

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]