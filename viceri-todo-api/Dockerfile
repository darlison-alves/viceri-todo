# Etapa 1: build
FROM node:18 AS build

# Define o diretório de trabalho
WORKDIR /app


# Copia o restante do código
COPY . .


# Instala as dependências
RUN npm install


# Compila o TypeScript para JavaScript
RUN npm run build

# Etapa 2: produção
FROM node:18-bullseye

# Define o diretório de trabalho
WORKDIR /app

# Instala SQLite no ambiente de produção
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copia apenas os arquivos necessários da etapa de build
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/database.db ./database.db

# Expõe a porta da aplicação (ajuste conforme necessário)
EXPOSE 3000

RUN ls -al /app
RUN ls -al /app/dist

# Comando para iniciar a API
CMD ["node", "dist/index.js"]
