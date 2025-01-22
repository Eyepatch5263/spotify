FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run seed:songs

RUN npm run seed:albums

EXPOSE 5000

CMD ["npm", "start"]

# run the command: npm run seed:songs and npm run seed:albums to load sample datas