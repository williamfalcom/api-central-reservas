FROM node:16
WORKDIR /app
ENV JWT_SECRET=hab267hdyrav57523abdf345
ENV DATABASE_URL=mongodb://mongo1,mongo2,mongo2/central-dev?connectTimeoutMS=1000
COPY . .
RUN npm install -g npm
RUN npm install
RUN npx prisma generate
EXPOSE 3000
ENTRYPOINT npm run start:prod