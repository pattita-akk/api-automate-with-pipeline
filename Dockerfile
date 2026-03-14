FROM node:22.18.0-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]