# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./

# Install app dependencies
RUN npm install -g bun
RUN bun install

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3001

# Start the server using the production build
CMD ["bun", "start:prod"]
