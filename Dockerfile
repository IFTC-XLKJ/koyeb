# FROM node:slim
FROM node:bullseye-slim
WORKDIR /app
COPY . .

ENV DEBIAN_FRONTEND=noninteractive

RUN apt upgrade
RUN apt update

RUN npm ci
RUN npm i @supabase/supabase-js
RUN npm i puppeteer
RUN npm i cookie-parser

# 安装 Chromium 和必要依赖
RUN apt-get update && \
    apt-get install -y \
    unzip \
    openjdk-17-jdk \
    dnsutils \
    sudo \
    curl \
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
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 告诉 Puppeteer 使用系统 Chromium
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


ARG PORT
EXPOSE ${PORT:-3000}

ENV ANDROID_HOME=/opt/android-sdk
ENV PATH="${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/build-tools/34.0.0"
ENV IFTC=IFTC

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools

RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip -q /tmp/cmdline-tools.zip -d /tmp && \
    mv /tmp/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm -f /tmp/cmdline-tools.zip

RUN yes | sdkmanager --licenses >/dev/null 2>&1 || true

RUN sdkmanager "build-tools;34.0.0"

RUN which apksigner && which zipalign
RUN apksigner --version
RUN zipalign

CMD ["node", "server.js"]

# RUN apt-get install sudo