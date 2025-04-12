# Etapa 1: build da aplicação Angular
FROM node:18 AS build

WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do projeto e faz o build
COPY . .
RUN npm run build --prod

# Etapa 2: servidor Nginx para servir os arquivos
FROM nginx:alpine

# Remove arquivos padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos do build Angular para a pasta pública do nginx
COPY --from=build /app/dist/viceri-todo-app/browser /usr/share/nginx/html

# Copia um arquivo custom de config (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expondo a porta padrão do Nginx
EXPOSE 80

# Start do Nginx
CMD ["nginx", "-g", "daemon off;"]
