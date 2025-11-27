FROM node:18-slim
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY src ./src

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
