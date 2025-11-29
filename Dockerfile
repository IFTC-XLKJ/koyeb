# FROM oven/bun:1
FROM node:slim
WORKDIR /app
COPY . .
RUN npm ci

ARG PORT
EXPOSE ${PORT:-3000}

ENV IFTC=IFTC

CMD ["node", "server.js"]