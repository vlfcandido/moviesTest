# Golden Raspberry API

## Sumário

1. [Visão Geral](#visão-geral)  
2. [Arquitetura e Organização](#arquitetura-e-organização)  
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)  
4. [Pré-requisitos e Instalação](#pré-requisitos-e-instalação)  
5. [Executando a Aplicação](#executando-a-aplicação)  
   - [Como Alterar o Arquivo CSV](#como-alterar-o-arquivo-csv)  
6. [Endpoints da API](#endpoints-da-api)  
7. [Estrutura de Retorno](#estrutura-de-retorno)  
8. [Funcionamento Interno](#funcionamento-interno)  
9. [Testes de Integração](#testes-de-integração)  
10. [Estrutura de Pastas](#estrutura-de-pastas)  
11. [Requisitos Atendidos](#requisitos-atendidos)  

---

## Visão Geral

A API processa a lista de indicados e vencedores do **Golden Raspberry Awards** para encontrar:  
- O **produtor com o menor intervalo** entre dois prêmios consecutivos.  
- O **produtor com o maior intervalo** entre dois prêmios consecutivos.  

A aplicação lê um **arquivo CSV** contendo os filmes e **armazena os dados em um banco de dados em memória**, garantindo execução rápida e sem dependências externas.

---

## Arquitetura e Organização

A API segue o **nível 2 de maturidade de Richardson** e utiliza uma estrutura modular baseada no padrão **Service-Repository**:

- **Controller**: Gerencia as requisições HTTP.  
- **Service**: Contém a lógica de negócio para calcular os intervalos dos prêmios.  
- **Repository**: Executa as operações no banco de dados SQLite em memória.  
- **Database**: Configura e inicializa o banco SQLite.  
- **Rotas**: Define os endpoints e associa aos controllers.  
- **Utils**: Contém scripts auxiliares, como o carregamento do CSV.  

---

## Tecnologias Utilizadas

- **Node.js**  
- **Express.js**  
- **SQLite**  
- **Jest + Supertest**  
- **CSV Parser**  

---

## Pré-requisitos e Instalação

### Requisitos

- **Node.js** versão **14+** (ou superior).  
- **Gerenciador de pacotes** (`npm` ou `yarn`).  

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/vlfcandido/moviesTest.git
cd moviesTest

# Instalar as dependências
npm install
```

---

## Executando a Aplicação

### Iniciar o Servidor

```bash
npm start
```

O servidor estará disponível em **http://localhost:3000** por padrão.  

**Observação**: A aplicação **lê e insere os dados do CSV automaticamente** no banco SQLite **ao iniciar**.

---

### Como Alterar o Arquivo CSV

Caso queira testar com um novo conjunto de filmes, siga os passos:

1. **Localize o arquivo CSV** na pasta `data/`.  
2. **Substitua pelo seu arquivo**, mantendo o formato:  
   ```
   year;title;studios;producers;winner
   1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
   1981;Mommie Dearest;Paramount Pictures;Frank Yablans;yes
   ```
3. **Reinicie a aplicação** (`npm start`).  

---

## Endpoints da API

### **GET** `/api/movies/awards/intervals`

**Objetivo:** Obter os produtores com **o menor e o maior intervalo** entre dois prêmios consecutivos de “Pior Filme”.

#### Exemplo de resposta:
```json
{
    "min": [
        {
            "producer": "Joel Silver",
            "interval": 1,
            "previousWin": 1990,
            "followingWin": 1991
        }
    ],
    "max": [
        {
            "producer": "Matthew Vaughn",
            "interval": 13,
            "previousWin": 2002,
            "followingWin": 2015
        }
    ]
}
```

Se não houver produtores com mais de uma vitória, a resposta será:
```json
{ "min": [], "max": [] }
```

---

## Estrutura de Pastas

```
moviesTest
│-- package.json
│-- server.js               # Inicializa a aplicação e popula o banco
│-- README.md
│-- tests
│   └── integration
│       └── movieApi.test.js
│-- src
    ├── app.js              # Configuração do Express
    ├── controllers
    │   └── movieController.js
    ├── db
    │   ├── database.js     # Configuração do SQLite em memória
    ├── repositories
    │   └── movieRepository.js
    ├── routes
    │   └── movies.js
    ├── services
    │   └── awardService.js # Lógica de cálculo de intervalos
    └── utils
        ├── populateDatabase.js # Carregamento de CSV e inserção no banco
```

---

## Requisitos Atendidos

- **Banco de dados em memória** utilizando SQLite (`":memory:"`).  
- **Leitura dinâmica de CSV**, permitindo testes com diferentes arquivos.  
- **API RESTful estruturada**, seguindo boas práticas.  
- **Testes de integração completos**, cobrindo diferentes cenários de dados.  
- **README detalhado**, com instruções claras para execução e testes.  
