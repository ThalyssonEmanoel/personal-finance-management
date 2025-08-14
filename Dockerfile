FROM node:18-alpine AS base

WORKDIR /node-app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3100
ENV PORT=${PORT}
EXPOSE ${PORT}

# Stage para desenvolvimento/testes (com devDependencies)
FROM base AS development
COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .

# Stage para produção (sem devDependencies)
FROM base AS production
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .

# Por padrão, usar o stage de desenvolvimento para que os testes funcionem
FROM development AS final

CMD ["npm", "start"]

# docker build -t sistema-de-refeicoes .
