# Golden Raspberry API

Este repositório contém uma API RESTful que processa e analisa a lista de indicados e vencedores da categoria **Pior Filme** do Golden Raspberry Awards. A aplicação **lê o arquivo CSV** com os filmes e **armazena tudo em um banco de dados em memória**, sem precisar instalar nenhum SGBD externo. O principal objetivo é **identificar os produtores** que receberam prêmios consecutivos, encontrando **o menor e o maior intervalo** entre as vitórias.

---

## Sumário

- [1. Principais Funcionalidades](#1-principais-funcionalidades)
- [2. Arquitetura e Organização](#2-arquitetura-e-organização)
- [3. Pré-requisitos e Instalação](#3-pré-requisitos-e-instalação)
- [4. Executando a Aplicação](#4-executando-a-aplicação)
  - [4.1. Como Alterar o Arquivo CSV](#41-como-alterar-o-arquivo-csv)
- [5. Endpoints da API](#5-endpoints-da-api)
- [6. Formato da API](#6-formato-da-api)
- [7. Funcionamento Interno (Serviços e Lógica)](#7-funcionamento-interno-serviços-e-lógica)
- [8. Testes de Integração](#8-testes-de-integração)
- [9. Requisitos Atendidos](#9-requisitos-atendidos)
- [10. Estrutura de Pastas](#10-estrutura-de-pastas)

---

## 1. Principais Funcionalidades

1. **Leitura de CSV e inserção em memória**  
   Ao iniciar, a aplicação lê um arquivo CSV contendo informações sobre os filmes indicados e vencedores da categoria “Pior Filme”, armazenando tudo em um banco SQLite em memória.
2. **API RESTful para análise de prêmios**  
   Disponibiliza um endpoint para identificar quais produtores ganharam múltiplos prêmios e **calcular o menor e maior intervalo** entre vitórias consecutivas.
3. **Nenhuma instalação externa**  
   O banco de dados roda em modo in-memory (similar a H2 no Java), então não há dependência de um servidor de banco de dados externo.
4. **Somente testes de integração**  
   Verifica o comportamento end-to-end da API (rota, lógica de negócio, banco de dados).

---

## 6. Formato da API

A resposta do endpoint segue o seguinte formato:
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
Isso garante um formato estruturado para facilitar a análise e consumo por outros sistemas.

---

## 8. Testes de Integração

Os testes garantem que a API funciona corretamente com diferentes cenários de dados e incluem:

### **Cenários testados**
- **Múltiplos produtores** vencendo em diferentes anos.
- **Anos duplicados** para garantir que não impactam os cálculos.
- **Cenário sem vencedores** onde a resposta deve ser `{ "min": [], "max": [] }`.
- **Falha no banco de dados** para validar tratamento de erro.

### **Execução dos testes**
Para rodar os testes, utilize:
```bash
npm test -- --verbose
```

---

## 9. Requisitos Atendidos

- **Banco de dados em memória**: utilizando SQLite (`":memory:"`).
- **Leitura dinâmica de CSV**: permitindo testes com diferentes arquivos.
- **API RESTful**: seguindo boas práticas e estrutura organizada.
- **Testes de integração completos**: cobrindo diferentes cenários de dados.

---

## 10. Estrutura de Pastas

```
golden-raspberry-api
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
    │   ├── database.js     # Configuração do banco SQLite em memória
    ├── repositories
    │   └── movieRepository.js
    ├── routes
    │   └── movies.js
    ├── services
    │   └── awardService.js # Lógica de cálculo de intervalos
    └── utils
        ├── populateDatabase.js # Script para carregar CSV e inserir no banco
```

