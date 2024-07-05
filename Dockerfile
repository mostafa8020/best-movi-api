# Base Image for Builder Stage
FROM node:18.13-alpine3.16 AS Builder

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Set nodejs environment
ENV NODE_ENV=development

# Install app dependencies, including devDependencies
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript files
RUN npm run build

# Install PM2 globally
RUN npm install pm2 -g

# Expose the port your app runs on
EXPOSE 3000

# Start your app using PM2
CMD ["pm2-runtime", "start", "dist/main.js", "--watch"]
