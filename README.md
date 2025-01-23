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
10. [Como Rodar os Testes](#como-rodar-os-testes)  
11. [Estrutura de Pastas](#estrutura-de-pastas)  
12. [Requisitos Atendidos](#requisitos-atendidos)  

---

## Visão Geral

A API processa a lista de indicados e vencedores do **Golden Raspberry Awards** para encontrar:  
- O **produtor com o menor intervalo** entre dois prêmios consecutivos.  
- O **produtor com o maior intervalo** entre dois prêmios consecutivos.  

A aplicação lê um **arquivo CSV** contendo os filmes e **armazena os dados em um banco de dados em memória**, garantindo execução rápida e sem dependências externas.

---

## Testes de Integração

Os testes garantem que a API funciona corretamente e cobrem os seguintes cenários:

1. **Produtores com múltiplos prêmios** - Verifica se o menor e maior intervalo estão corretos.
2. **Sem vencedores** - O endpoint deve retornar `{ "min": [], "max": [] }`.
3. **Banco de dados vazio** - A aplicação não deve quebrar caso não haja dados carregados.
4. **Filmes com anos repetidos** - Testa se anos duplicados não afetam os cálculos.
5. **Erros no banco** - Simula falhas no banco e verifica se a API responde corretamente.
6. **Validação de consistência com os dados do CSV** - Verifica se os dados retornados pela API correspondem exatamente aos dados carregados a partir do arquivo CSV utilizado pelo sistema. O teste:
   - Lê os dados do arquivo CSV de referência.
   - Insere os filmes no banco de dados em memória antes de cada teste.
   - Chama o endpoint `/api/movies/awards/intervals` e compara o retorno com os dados processados do CSV.
   - Falha caso haja qualquer divergência entre os dados esperados e os obtidos pela API.

---

## Como Rodar os Testes

Os testes utilizam **Jest + Supertest** para simular chamadas HTTP e verificar o funcionamento completo da API.

### **Executando os Testes**
```bash
npm test -- --verbose
```

O comando executa todos os testes na pasta `tests/integration` e exibe os logs de cada teste executado.

### **Resultados Esperados**
- Status `200` para consultas bem-sucedidas.
- Retorno de listas vazias quando apropriado.
- Manipulação correta de anos repetidos e múltiplos produtores.
- Retorno de erro `500` caso ocorra uma falha no banco.
- Correspondência exata entre os dados retornados pela API e os dados processados do arquivo CSV de referência.

---

## Estrutura de Pastas

```
moviesTest
│-- package.json
│-- server.js
│-- README.md
│-- tests
│   └── integration
│       └── movieApi.test.js
│-- src
    ├── controllers
    ├── db
    ├── repositories
    ├── routes
    ├── services
    ├── utils
```