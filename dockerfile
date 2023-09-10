FROM oven/bun

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY ./bot.js ./bot.js

CMD ["bun", "bot.js"]
