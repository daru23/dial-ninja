ARG node_version="16"

# Use an official Node.js runtime as the base image
FROM node:${node_version}

# Copying app files
COPY ./app /app

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./app

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Command to run your application
CMD [ "node", "index.ts" ]
