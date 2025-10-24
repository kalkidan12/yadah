# ======================
# 1. Builder stage
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build-time ARG for frontend API URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js
RUN npm run build

# ======================
# 2. Runner stage
# ======================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

# Run backend with runtime secrets from env_file
CMD ["npm", "start"]