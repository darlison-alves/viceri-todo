### E se você precisar disponibilizar essa aplicação na AWS?
### Descreva brevemente como o faria.

--------------------

#### Frontend

1 - Build da aplicação

```
ng build --configuration production
```
Isso cria os arquivos de produção na pasta dist/.

2 - Criar um bucket no Amazon S3

3 - Enviar os arquivos para o S3

```
aws s3 sync dist/nome-do-projeto s3://viceri-todo-app --delete
```

3 - Configurar CloudFront

* Crio uma distribuição do CloudFront apontando para o bucket.
* Isso melhora performance e segurança.
* Adiciono domínio personalizado se quiser com certificado SSL.


#### Backend

### Opção 1: 

**AWS Elastic Beanstalk – deploy simplificado**

1 - Empacota a API;

2 - Cria um ambiente no Beanstalk;

3 - Faz o deploy com
- via interface da aws
- linha de commando

Ele cuida do EC2, balanceador, escalabilidade e logs.

### Opção 2: 
**AWS ECS (Elastic Container Service) - mais rebusto**

1 - Com os Dockerfile do projeto

2 - Build da imagem

3 - Subir a imagem no ECR (Elastic Container Registry)
- Criar repositório no ECR;
- Tag + push da imagem

```
docker tag minha-api-node:latest <seu-id>.dkr.ecr.<região>.amazonaws.com/minha-api-node
docker push <seu-id>.dkr.ecr.<região>.amazonaws.com/minha-api-node
```

4 - Criar um cluster no ECS

5 - Criar task definition (definição da tarefa)

6 - Rodo a Task ou criar um Service
