
# Use an official Node.js runtime as the base image
# FROM node:21-alpine
FROM public.ecr.aws/docker/library/node:21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
# npm ci, which installs dependencies based exactly on your lock file, faster and cleaner than npm install
# --only=production flag skips devDependencies, reducing the image size and attack surface
RUN npm install
# Must ensure dist/ is passed as an artifact from the build job to the containerization job
COPY . . 

# Optional — just for documentation
EXPOSE 3000  

# node dist/main It launches your NestJS app from the compiled entry file
CMD ["npm", "start"]
