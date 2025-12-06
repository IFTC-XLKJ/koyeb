FROM node:slim
WORKDIR /app
COPY . .

RUN apt upgrade
# RUN apt install sudo

RUN npm ci
RUN npm install @supabase/supabase-js

ARG PORT
EXPOSE ${PORT:-3000}

ENV IFTC=IFTC

CMD ["node", "server.js"]