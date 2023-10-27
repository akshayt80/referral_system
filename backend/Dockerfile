FROM node:18.4

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 5050

ENTRYPOINT ["sh", "./scripts/run.sh"]
