FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN npm install express
# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "node", "app.js" ]