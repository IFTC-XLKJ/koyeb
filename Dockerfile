FROM node:slim
WORKDIR /app
COPY . .

RUN apt upgrade
RUN apt update

RUN npm ci
RUN npm install @supabase/supabase-js
RUN npm install puppeteer

# 安装 Chromium 和必要依赖
RUN apt-get update && \
    apt-get install -y \
    dnsutils \
    sudo \
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
    fonts-noto-cjk \
    fonts-wqy-zenhei \
    fonts-wqy-microhei \
    fonts-droid-fallback \
    fonts-dejavu \
    # 👇 关键：以下这些常被遗漏，但 Chrome 需要
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrender1 \
    libxtst6 \
    wget \
    gnupg && \
    rm -rf /var/lib/apt/lists/*

# 告诉 Puppeteer 使用系统 Chromium
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


ARG PORT
EXPOSE ${PORT:-3000}

ENV IFTC=IFTC

CMD ["node", "server.js"]

# RUN apt-get install sudo