ARG node_version="16"

# Use an official Node.js runtime as the base image
FROM node:${node_version} as base

# Copying app files
COPY ./app /app

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./app

# Install application dependencies
RUN npm install --production

# Copy the rest of the application code to the container
COPY . .

##################
# Adds production assets
FROM base as prod

# For security, use a non-privileged user
USER app

# Copy the rest of the application code to the container
COPY . .

# Build the TypeScript code
RUN npm run build

##################
# Install dev deps
FROM base as ci

# Install dev dependencies
RUN npm install --dev

# Copy the rest of the application code to the container
COPY . .

# Command to run your application
CMD [ "npm", "run", "dev" ]
