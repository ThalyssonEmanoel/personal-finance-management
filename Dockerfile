# Builder stage: use Debian-based Node to avoid musl binary downloads
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# install all deps (including dev) required for prisma generate
COPY package.json package-lock.json ./
RUN npm ci

# copy source, generate prisma client
COPY . .
RUN npx prisma generate

# Prune dev deps to keep runtime lean (optional)
RUN npm prune --production

# Final stage: runtime image
FROM node:20-bullseye-slim
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG PORT=3100
ENV PORT=${PORT}
EXPOSE ${PORT}

COPY --from=builder /app ./

CMD ["npm", "start"]