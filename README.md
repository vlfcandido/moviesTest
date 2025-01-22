# Golden Raspberry API

## Sobre o Projeto
A Golden Raspberry API é uma API REST desenvolvida para calcular os produtores com maior e menor intervalo entre prêmios consecutivos da categoria "Pior Filme". O projeto integra um banco de dados SQLite para armazenar e recuperar informações sobre os filmes premiados.

## Tecnologias Utilizadas
- Node.js
- Express.js
- SQLite3
- Jest + Supertest (para testes de integração)

## Regras de Negócio
1. A API deve armazenar informações sobre filmes e seus respectivos vencedores da categoria "Pior Filme".
2. A API deve ser capaz de calcular os produtores que receberam o prêmio múltiplas vezes e determinar o menor e o maior intervalo entre vitórias consecutivas.
3. Se um produtor venceu mais de uma vez, a API deve calcular a diferença entre os anos das vitórias consecutivas.
4. Caso um produtor tenha apenas uma vitória, ele não deve ser incluído no cálculo de intervalos.
5. Caso não existam vencedores registrados, a API deve retornar uma lista vazia.

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

### Criar e popular o banco de dados
Caso o banco ainda não tenha sido criado, execute o seguinte comando:
```sh
$ node src/utils/populateDatabase.js
```
Isso garantirá que a tabela `movies` seja criada e populada corretamente.

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
Este método obtém os produtores com maior e menor intervalo entre prêmios consecutivos. Ele segue os seguintes passos:
1. Recupera os produtores vencedores da base de dados.
2. Agrupa os vencedores por produtor e ordena os anos de vitória.
3. Calcula os intervalos entre os anos consecutivos de vitórias.
4. Retorna os produtores com os menores e maiores intervalos.

Se não houver vencedores registrados ou se nenhum produtor tiver mais de uma vitória, o método retorna listas vazias.

## Testes de Integração

### Executar os testes automaticamente
```sh
$ npm test -- --verbose
```

### Estrutura dos Testes
Os testes de integração cobrem os seguintes cenários:
1. Quando há produtores com prêmios consecutivos, o endpoint deve retornar corretamente os menores e maiores intervalos.
2. Quando há apenas um vencedor único, a API deve retornar uma lista vazia.
3. Quando não há vencedores no banco, a API deve retornar uma resposta sem resultados.

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
