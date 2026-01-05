# Use Node.js LTS image (Debian-based to ensure OpenSSL compatibility for Prisma)
FROM node:18-bullseye-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev for Prisma CLI), but skip postinstall scripts
RUN npm install --ignore-scripts

# Copy application code
COPY . .

# Generate Prisma client after source is available
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
