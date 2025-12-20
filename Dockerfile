FROM node:slim
WORKDIR /app
COPY . .

RUN apt upgrade
RUN apt update

RUN npm ci
RUN npm install @supabase/supabase-js

# 安装 Chromium 和必要依赖
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# 告诉 Puppeteer 使用系统 Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm install puppeteer

ARG PORT
EXPOSE ${PORT:-3000}

ENV IFTC=IFTC

CMD ["node", "server.js"]

RUN apt install sudo