# # Use the official Node.js image as the base image
# FROM node:20

# # Set the working directory inside the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install the application dependencies
# RUN npm install

# # Copy the rest of the application files
# COPY . .

# # Build the NestJS application
# RUN npm run build

# # Expose the application port
# EXPOSE 3000

# # Command to run the application
# CMD ["node", "dist/main"]

# -------- Build Stage --------
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# -------- Production Stage --------
FROM node:22-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]