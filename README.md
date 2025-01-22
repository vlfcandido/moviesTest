# Golden Raspberry API

## Sobre o Projeto
A Golden Raspberry API é uma API RESTful desenvolvida para processar e analisar a lista de indicados e vencedores da categoria "Pior Filme" do Golden Raspberry Awards. O sistema lê os dados de um arquivo CSV e armazena essas informações em um banco de dados em memória. O principal objetivo da API é fornecer informações sobre os produtores que receberam prêmios consecutivos, identificando o menor e o maior intervalo entre essas vitórias.

## Tecnologias Utilizadas
- Node.js
- Express.js
- SQLite3 (banco de dados em memória)
- Jest + Supertest (para testes de integração)

## Requisitos do Sistema
1. A API deve ler o arquivo CSV com os filmes e inserir os dados em um banco de dados em memória ao iniciar a aplicação.
2. O banco de dados deve ser um SGBD embarcado, como SQLite, para facilitar a execução sem dependências externas.
3. Nenhuma instalação de banco de dados externa deve ser necessária.
4. O web service RESTful deve seguir o nível 2 de maturidade de Richardson.
5. Devem ser implementados somente testes de integração para garantir que os dados obtidos correspondem aos dados da proposta.

## Regras de Negócio
1. A API deve armazenar informações sobre os filmes e seus respectivos vencedores da categoria "Pior Filme".
2. A API deve calcular quais produtores receberam múltiplos prêmios e determinar o menor e maior intervalo entre suas vitórias consecutivas.
3. Apenas produtores que ganharam mais de uma vez são incluídos nos cálculos de intervalo.
4. Se um produtor venceu apenas uma vez, ele não deve ser incluído na resposta.
5. Se não houver vencedores registrados, a API deve retornar uma lista vazia.

## Configuração do Ambiente

### Clonar o repositório
```sh
$ git clone https://github.com/seu-usuario/golden-raspberry-api.git
$ cd golden-raspberry-api
```

### Instalar dependências
```sh
$ npm install
```

### Iniciar o servidor
```sh
$ npm start
```
O servidor estará rodando em `http://localhost:3000`.

## Endpoints

### Obter produtores com maior e menor intervalo entre prêmios

#### Requisição:
```http
GET /movies/awards/intervals
```

#### Resposta esperada (exemplo):
```json
{
  "min": [
    {
      "producer": "Produtor X",
      "interval": 1,
      "previousWin": 2000,
      "followingWin": 2001
    }
  ],
  "max": [
    {
      "producer": "Produtor Y",
      "interval": 10,
      "previousWin": 1990,
      "followingWin": 2000
    }
  ]
}
```

## Implementação dos Métodos

### `getProducerAwardIntervals()`
Este método processa os dados dos produtores e determina quais receberam prêmios consecutivos. Ele segue os seguintes passos:
1. Recupera da base de dados todos os vencedores da categoria "Pior Filme".
2. Agrupa os filmes por produtor, garantindo que múltiplos produtores em um mesmo filme sejam considerados separadamente.
3. Ordena os anos de vitória de cada produtor para calcular corretamente os intervalos entre prêmios consecutivos.
4. Calcula o menor e o maior intervalo de tempo entre as vitórias de cada produtor.
5. Retorna um JSON com os produtores que possuem os menores e maiores intervalos registrados.

Se não houver produtores com múltiplas vitórias, a API retorna listas vazias.

## Testes de Integração

### Executar os testes automaticamente
```sh
$ npm test -- --verbose
```

### Estrutura dos Testes
Os testes de integração cobrem os seguintes cenários:
1. Quando há produtores com prêmios consecutivos, o endpoint deve retornar corretamente os menores e maiores intervalos.
2. Quando há apenas um vencedor único, a API deve retornar uma lista vazia.
3. Quando não há vencedores no banco, a API deve retornar uma resposta vazia sem erros.
4. O banco de dados deve ser populado corretamente a partir do arquivo CSV e responder de acordo com os dados originais.

### Exemplo de saída esperada
```sh
PASS  tests/integration/movieApi.test.js
  ✓ Deve retornar os produtores com maior e menor intervalo entre prêmios (20 ms)
  ✓ Deve retornar lista vazia quando não há vencedores (10 ms)
```

## Estrutura do Projeto

```
📂 golden-raspberry-api
│-- 📂 src
│   │-- 📂 controllers       # Lógica dos endpoints
│   │-- 📂 services          # Regras de negócio
│   │-- 📂 repositories      # Interação com o banco de dados
│   │-- 📂 db                # Configuração do banco SQLite
│   │-- 📂 routes            # Definição das rotas
│   │-- 📂 utils             # Scripts auxiliares
│   │-- app.js               # Arquivo principal do servidor
│-- 📂 tests
│   │-- 📂 integration       # Testes de integração
│-- package.json
│-- README.md
```
