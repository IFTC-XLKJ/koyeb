FROM node:slim
WORKDIR /app
COPY . .

RUN apt upgrade
RUN apt update

RUN npm ci
RUN npm install @supabase/supabase-js
RUN npm install puppeteer

# 安装 Chromium 和必要依赖
RUN apt-get install -y \
    libglib2.0-0 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxss1 \
    libnss3 \
    libnspr4 \
    libfontconfig1 \
    libexpat1 \
    ca-certificates \
    fonts-liberation \
    wget \
    gnupg && \
    rm -rf /var/lib/apt/lists/*

# 告诉 Puppeteer 使用系统 Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


ARG PORT
EXPOSE ${PORT:-3000}

ENV IFTC=IFTC

CMD ["node", "server.js"]

# RUN apt-get install sudo