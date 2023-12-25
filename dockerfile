FROM oven/bun

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY ./ /app

CMD [
    "bun", "deploy_commands.ts",
    "&&",
    "bun", "bot.ts"
    ]
