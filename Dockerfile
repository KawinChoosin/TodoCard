# Use the official Node.js image
FROM node:16

# Create and change to the app directory
WORKDIR /src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code to the container image
COPY . .

# Make port 3333 available to the world outside this container
EXPOSE 3333

# Run the web service on container startup
CMD ["npm", "run", "dev"]
