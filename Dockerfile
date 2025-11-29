FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
# RUN npm -v
RUN node -v

ARG PORT
EXPOSE ${PORT:-3000}

ENV IFTC=IFTC

CMD ["node", "server.js"]