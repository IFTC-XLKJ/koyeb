FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["node", "server.js"]
