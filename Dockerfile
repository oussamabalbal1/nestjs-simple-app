# Use an official Node.js runtime as the base image
# FROM node:21-alpine
FROM public.ecr.aws/docker/library/node:21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your NestJS app runs on
EXPOSE 3000

# Start the application using npm start
CMD ["npm", "start"]
