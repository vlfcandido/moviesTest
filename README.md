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

## 2. Arquitetura e Organização

A aplicação segue o padrão:

- **Controller**: recebe as requisições HTTP e retorna as respostas.  
- **Service**: contém a regra de negócio (cálculo dos intervalos).  
- **Repository**: responsável por operar no banco (inserir, consultar).  
- **Database**: inicializa o SQLite em memória e cria a tabela.  
- **Rotas**: arquivo que define os endpoints (quais URIs chamam qual controller).  
- **Utils**: scripts auxiliares (ex.: carregamento de CSV).

Visando o nível 2 de maturidade de Richardson, utilizamos **Express** para implementar um web service RESTful que manipula recursos (filmes) e retorna JSON.

---

## 3. Pré-requisitos e Instalação

1. **Node.js** versão 14+ (ou superior).
2. **NPM** (ou Yarn) para instalar as dependências.

### Passo a passo

```bash
# Clonar o repositório
git clone https://github.com/vlfcandido/golden-raspberry-api.git
cd golden-raspberry-api

# Instalar as dependências do Node
npm install
```

---

## 4. Executando a Aplicação

### Iniciar o Servidor

```bash
npm start
```
Por padrão, o servidor inicia em **http://localhost:3000** (ou a porta definida na variável de ambiente `PORT`).

**Obs.:** Ao iniciar, a aplicação lerá o CSV (cujo caminho é configurado internamente) e criará a tabela `movies` em memória, inserindo os dados. Toda vez que a aplicação reinicia, o banco é recriado (pois é in-memory).

#### 4.1. Como Alterar o Arquivo CSV

Caso queira testar a API com outro conjunto de filmes, basta substituir o arquivo CSV usado na inicialização.

1. **Localize o arquivo CSV padrão** usado pela aplicação. O caminho pode ser encontrado no arquivo `src/utils/populateDatabase.js`:
   ```js
   const csvFilePath = path.join(__dirname, "../../data/movies.csv");
   ```
2. **Substitua o arquivo** `movies.csv` dentro da pasta correspondente (`data/`) pelo seu próprio CSV, garantindo que siga o mesmo formato de colunas.
3. **Reinicie a aplicação** para que os novos dados sejam carregados no banco de dados em memória.
4. **Verifique a formatação** do seu CSV:
   - As colunas devem seguir a ordem correta (ano, título, estúdio, produtor, vencedor).
   - O separador deve ser `;` para garantir que a leitura seja feita corretamente.
   - Certifique-se de que os campos `winner` contenham apenas `yes` ou `no`.

Se precisar testar diferentes arquivos CSV, basta repetir esse processo.

---

## 5. Endpoints da API

### **GET** `/api/movies/awards/intervals`

- **Objetivo**: Obter os produtores com o **maior** e **menor** intervalo entre dois prêmios consecutivos de “Pior Filme”.
- **Resposta (JSON)**:
  ```json
  {
    "min": [...],
    "max": [...]
  }
  ```
- **Observação**: Se não houver produtores com mais de uma vitória, a resposta retorna `{ "min": [], "max": [] }`.

---

## 6. Funcionamento Interno (Serviços e Lógica)

A aplicação busca todos os vencedores no banco de dados, agrupa-os por produtor e calcula os intervalos entre suas vitórias consecutivas. Se um produtor venceu apenas uma vez, ele não é considerado.

A função `getProducerAwardIntervals()` executa os seguintes passos:
1. **Busca os vencedores** no banco de dados através do `MovieRepository.getWinningProducers()`.
2. **Divide produtores múltiplos** (quando há mais de um por filme).
3. **Ordena os anos** de vitória para cada produtor.
4. **Ignora anos duplicados** para evitar intervalos incorretos.
5. **Calcula intervalos** entre as vitórias consecutivas.
6. **Identifica os menores e maiores intervalos** para retorno.

---

## 7. Testes de Integração

Os testes garantem que a API funciona corretamente com diferentes cenários de dados e incluem:
- **Múltiplos produtores** vencendo em diferentes anos.
- **Anos duplicados** para garantir que não impactam os cálculos.
- **Cenário sem vencedores** onde a resposta deve ser `{ "min": [], "max": [] }`.

Para rodar os testes:
```bash
npm test -- --verbose
```

---

## 8. Requisitos Atendidos

- **Banco de dados em memória**: utilizando SQLite (`":memory:"`).
- **Leitura dinâmica de CSV**: permitindo testes com diferentes arquivos.
- **API RESTful**: seguindo boas práticas e estrutura organizada.
- **Testes de integração completos**: cobrindo diferentes cenários de dados.

---

## 9. Estrutura de Pastas

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

