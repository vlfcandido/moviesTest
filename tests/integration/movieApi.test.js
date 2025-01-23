const request = require("supertest");
const app = require("../../src/app");
const { db, initializeDatabase } = require("../../src/db/database");
const CsvService = require("../../src/services/csvService");

const csvService = new CsvService("./tests/data/movies.csv"); // Caminho do CSV de testes

/**
 * Antes de cada teste:
 * - Inicializa o banco de dados
 * - Limpa a tabela de filmes
 * - Insere os filmes do CSV no banco
 */
beforeEach(async () => {
  await initializeDatabase();

  await new Promise((resolve, reject) => {
    db.run("DELETE FROM movies", (err) => (err ? reject(err) : resolve()));
  });

  const movies = await csvService.loadCSV();

  await Promise.all(
    movies.map((movie) => {
      return new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO movies (year, title, studios, producers, winner)
           VALUES (?, ?, ?, ?, ?)`,
          [movie.year, movie.title, movie.studios, movie.producers, movie.winner],
          (err) => (err ? reject(err) : resolve())
        );
      });
    })
  );
});

/**
 * Teste de integração para validar se a API retorna os dados esperados com base no CSV.
 * 
 * O teste verifica se:
 * - O status HTTP retornado é 200
 * - O corpo da resposta está no formato correto
 * - Os valores retornados pela API correspondem exatamente aos cálculos baseados no CSV
 */
describe("GET /api/movies/awards/intervals - Validação com os dados do CSV", () => {
  test("Deve garantir que o retorno da API corresponde exatamente ao esperado", async () => {
    const response = await request(app).get("/api/movies/awards/intervals");

    console.log("DEBUG - Resposta da API:", response.body);

    const expectedResponse = processExpectedResponse(await csvService.loadCSV());

    console.log("DEBUG - Resposta esperada:", expectedResponse);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });
});

/**
 * Processa os dados do CSV para transformar no formato esperado da API.
 * 
 * Etapas:
 * 1. Filtra apenas os filmes vencedores.
 * 2. Agrupa os filmes por produtor.
 * 3. Ordena os anos de vitória de cada produtor.
 * 4. Calcula os intervalos entre vitórias consecutivas.
 * 5. Identifica os menores e maiores intervalos.
 * 6. Retorna os dados no formato esperado pela API.
 * 
 * @param {Array} movies - Lista de objetos representando os filmes lidos do CSV.
 * @returns {Object} Retorno esperado no formato da API.
 */
function processExpectedResponse(movies) {
    const producers = {};

    // Filtra apenas os filmes vencedores
    movies
        .filter((movie) => movie.winner === "yes")
        .forEach((movie) => {
            const producer = movie.producers;
            const year = parseInt(movie.year, 10);

            // Agrupa os anos de vitória por produtor
            if (!producers[producer]) {
                producers[producer] = [];
            }
            producers[producer].push(year);
        });

    // Calcula os intervalos entre vitórias consecutivas
    const intervals = Object.entries(producers)
        .map(([producer, years]) => {
            years.sort((a, b) => a - b); // Ordena os anos para garantir intervalos corretos
            return years.slice(1).map((year, i) => ({
                producer,
                interval: year - years[i], // Diferença entre anos consecutivos
                previousWin: years[i],
                followingWin: year
            }));
        })
        .flat();

    // Retorna listas vazias caso nenhum produtor tenha vencido mais de uma vez
    if (intervals.length === 0) {
        return { min: [], max: [] };
    }

    // Identifica os menores e maiores intervalos
    const minInterval = Math.min(...intervals.map((i) => i.interval));
    const maxInterval = Math.max(...intervals.map((i) => i.interval));

    return {
        min: intervals.filter((i) => i.interval === minInterval),
        max: intervals.filter((i) => i.interval === maxInterval)
    };
}
