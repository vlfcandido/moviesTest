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
- [6. Funcionamento Interno (Serviços e Lógica)](#6-funcionamento-interno-serviços-e-lógica)
- [7. Testes de Integração](#7-testes-de-integração)
- [8. Requisitos Atendidos](#8-requisitos-atendidos)
- [9. Estrutura de Pastas](#9-estrutura-de-pastas)

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

## 6. Funcionamento Interno (Serviços e Lógica)

### **Método getProducerAwardIntervals**

A função `getProducerAwardIntervals()` executa os seguintes passos:
1. **Busca os vencedores** no banco de dados através do `MovieRepository.getWinningProducers()`.
2. **Divide produtores múltiplos** (quando há mais de um por filme), separando por vírgula e "and".
3. **Ordena os anos** de vitória para cada produtor.
4. **Ignora anos duplicados** para evitar intervalos incorretos.
5. **Calcula intervalos** entre as vitórias consecutivas.
6. **Identifica os menores e maiores intervalos** para retorno.

Este método também inclui logs para depuração e tratamento de erros para casos onde os dados estejam inconsistentes ou faltantes.

---

## 7. Testes de Integração

Os testes garantem que a API funciona corretamente com diferentes cenários de dados e incluem:

### **Cenários testados**
- **Múltiplos produtores** vencendo em diferentes anos.
- **Anos duplicados** para garantir que não impactam os cálculos.
- **Cenário sem vencedores** onde a resposta deve ser `{ "min": [], "max": [] }`.

### **Estrutura dos testes**
Os testes utilizam **Supertest** para realizar requisições HTTP na API em um banco de dados SQLite em memória. Antes de cada teste, a tabela `movies` é reinicializada.

#### **Execução dos testes**
Para rodar os testes, utilize:
```bash
npm test -- --verbose
```

O teste principal verifica:
- Se o endpoint `/api/movies/awards/intervals` responde corretamente.
- Se os dados retornados correspondem aos intervalos esperados.
- Se os status HTTP estão corretos, sendo `200` quando existem vencedores e `404` quando não existem registros elegíveis.

---

