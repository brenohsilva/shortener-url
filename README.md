# Encurtador de URL - Versão 0.3.0

Este é um serviço de API REST para encurtamento de URLs, construído com NestJS, Prisma e PostgreSQL

## Recursos Implementados (v0.3.0)

- Operações de usuário (Listar, atualizar, deletar) no encurtador URL.

- Novos testes unitários para URL Controller e URL Service.

- Atualização da documentação Swagger de todos os recursos.

- Tratamento de retornos de arrays vazios com Interceptor.


# Recursos Atuais

- Criação de URLs encurtadas a partir de uma URL original.

- Redirecionamento da URL encurtada para a URL original.

- Ambiente de desenvolvimento totalmente containerizado com Docker Compose.

- Documentação inicial da API disponível via Swagger (OpenAPI).

- Criação de Usuários.

- Autenticação.

- Atualização, remoção e listagem de usuários (Somente autenticado).

- Operações de usuário (Listar, atualizar, deletar) no encurtador URL.

- Novos testes unitários para URL Controller e URL Service.

- Atualização da documentação Swagger de todos os recursos.

- Tratamento de retornos de arrays vazios com Interceptor.

## Como Começar

Para executar este projeto localmente, você precisará ter o Docker e o Docker Compose instalados.

**Clone o repositório:**
```
git clone https://github.com/brenohsilva/shortener-url.git
cd shortener-url
```

**Crie o arquivo de ambiente:**
Crie um novo arquivo chamado .env e copie o contéudo abaixo para dentro desse arquivo

```
DATABASE_URL="mysql://root:root@localhost:4306/url-db"
BASE_URL="http://localhost:3000"
CORS_ALLOWED_ORIGINS=http://localhost:3000
JWT_SECRET='TeddyOpenFinance'
```
**Inicie a aplicação com Docker Compose:**
Este comando irá construir as imagens Docker, iniciar os contêineres do banco de dados e da API, e aplicar as migrações do banco de dados automaticamente.

```
docker-compose up --build
A aplicação estará disponível em http://localhost:3000.
```

**Documentação da API**

Com a aplicação em execução, a documentação da API gerada pelo Swagger pode ser acessada no seguinte endereço:

http://localhost:3000/api-docs