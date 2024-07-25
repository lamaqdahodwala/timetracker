FROM node:20

WORKDIR /app

COPY ./package.json .

RUN npm install -g pnpm

RUN pnpm install


COPY . .

RUN pnpm prisma generate

EXPOSE 5173

CMD [ "pnpm", "dev", "--host", "127.0.0.1"]
