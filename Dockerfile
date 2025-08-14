FROM node:18-alpine

WORKDIR /node-app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3100
ENV PORT=${PORT}
EXPOSE ${PORT}

# Primeiro instala as dependências
COPY package.json package-lock.json ./
RUN npm ci
RUN npm install jest
RUN npm install supertest

# Depois copia o projeto (Isto torna mais rápido o build devido ao cache)
COPY . .
RUN npx prisma generate


# Eu sinceramente prefiro dessa forma, mas se deer B.O eu coloco o ENTRYPOINT npm start de volta 
# Acho melhor pq ele permite que eu passe argumentos para o npm start tipo: --port=3000

CMD ["npm", "start"]

# docker build -t sistema-de-refeicoes .
