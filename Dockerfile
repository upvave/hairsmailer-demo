FROM node:23-alpine

# Set working directory
WORKDIR /app

# Install OpenSSL and other dependencies
# Using su-exec for better process management in Docker
RUN apk add --no-cache openssl curl su-exec

# Install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy application files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
