FROM oven/bun

WORKDIR /app

COPY package*.json ./

RUN bun install

# pass a variable to the environment from host
ENV GH_SHA=$GH_SHA

COPY ./bot.ts ./bot.ts

CMD ["bun", "bot.ts"]
