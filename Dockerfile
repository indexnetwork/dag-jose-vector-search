FROM node:22-alpine

# Install dependencies
RUN apk add --no-cache make gcc g++ python3

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json package-lock.json ./

# Install node modules
RUN npm install

# Copy the rest of the application
COPY . .

# Build the native modules
RUN npm rebuild hnswlib-node

# Expose port and start application
EXPOSE 3000
CMD ["node", "index.js"]
