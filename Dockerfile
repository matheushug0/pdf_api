FROM node:20-bullseye

# Instalar libs necessárias para o Chromium funcionar
RUN apt-get update && apt-get install -y \
  libnss3 \
  libatk-bridge2.0-0 \
  libx11-xcb1 \
  libdrm2 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libatk1.0-0 \
  libatspi2.0-0 \
  libcurl4 \
  libgtk-3-0 \
  libxss1 \
  libxtst6 \
  libnss3 \
  libxshmfence1 \
  libpci3 \
  libglib2.0-0 \
  libdbus-1-3 \
  libx11-6 \
  libxcb1 \
  libdrm2

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]