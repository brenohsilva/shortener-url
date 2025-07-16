# Encurtador de URL - Versão 1.0.0

Este é um serviço de API REST para encurtamento de URLs, construído com NestJS, Prisma e Mysql.

## Recursos Implementados (v1.0.0)

- Criação de URLs encurtadas a partir de uma URL original.

- Redirecionamento da URL encurtada para a URL original.

- Ambiente de desenvolvimento totalmente containerizado com Docker Compose.

- Documentação inicial da API disponível via Swagger (OpenAPI).

- Criação de Usuários.

- Autenticação.

- Atualização, remoção e listagem de usuários (Somente autenticado).

- Operações de usuário (Listar, atualizar, deletar) no encurtador URL.

- Implementação abstrata de Loggers para observabilidade.


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
LOG_RULES='level=debug'

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


**Testes Unitários**
é Possivel rodar todos os testes unitários da aplicação com o comando: 
```
npm run test
```

**Possiveis Melhorias para uma escalabilidade Horizontal**

1. Implementação de um In-memory cache com Redis ou Memcached. Com o aumento de usuários e requisições, principalmente
para a leitura e redirecionamento das urls a busca das urls no banco de dados tornaria a API lenta. Com isso a implementação de cache entre o servidor da API e o banco de dados seria um ponto chave para uma maior fluidez do fluxo da API, em vez de acessar o disco, acessamos diretamente a memória.

- Desafios de implementar essa solução: Complexidade na arquitetura, é preciso tomar decisões cuidadosas sobre o tamanho do cache, políticas de descarte e quais entradas devem ser armazenadas

2. Replicação do Banco de Dados para Alta Disponibilidade. A replicação do banco de dados é uma estratégia fundamental para garantir a disponibilidade do sistema em cenários de falha de hardware ou picos de acesso.  Se o servidor principal falhar, o sistema pode redirecionar as requisições para uma réplica, evitando downtime e perda de dados.

- Desafios de implementar essa solução: Mais uma vez a complexidade na arquitetura é um problema. É necessário garantir que o servidor primário consiga se comunicar corretamente com as réplicas, além de lidar com possíveis atrasos na sincronização. A promoção automática de uma réplica para primária em caso de falha também precisa ser cuidadosamente configurada para evitar inconsistências e interrupções no serviço.