FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh /usr/local/bin/start.sh

# RUN npx prisma migrate deploy
RUN npm run build
# CMD ["npm", "start"]
ENTRYPOINT [ "/usr/local/bin/start.sh" ]

EXPOSE 3333
