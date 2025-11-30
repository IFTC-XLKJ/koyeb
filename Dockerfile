# FROM oven/bun:1
FROM node:slim
WORKDIR /app
COPY . .
RUN npm ci
RUN npm i puppeteer
RUN npm i puppeteer-core
ARG PORT
EXPOSE ${PORT:-3000}

ENV IFTC=IFTC

CMD ["node", "server.js"]