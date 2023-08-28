FROM node:alpine

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json /app/
WORKDIR /app
RUN npm install

# Copy the rest of the application code
COPY . /app/

# Set the working directory and start the Node.js application
WORKDIR /app
CMD ["node", "index.js"]
