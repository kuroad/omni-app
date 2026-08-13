FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start in Dev mode
CMD ["npm", "run", "dev"]
