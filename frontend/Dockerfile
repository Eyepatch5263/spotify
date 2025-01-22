FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

# this command is used to serve the files over port 3000
# serve is the npm package for serving the files
# -s flag is used to serve the static files
# -l flag is used to specify the port
# dist is the folder where the build files are stored
CMD ["serve", "-s", "dist", "-l", "3000"]