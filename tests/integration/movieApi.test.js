const request = require("supertest");
const app = require("../../src/app");
const { db, initializeDatabase } = require("../../src/db/database");

/**
 * Limpa e reinicializa a tabela 'movies' antes de cada teste,
 * garantindo que a tabela existe e está vazia.
 */
beforeEach(async () => {
  // 1) Garante que a tabela 'movies' foi criada:
  await initializeDatabase();

  // 2) Limpa registros anteriores:
  await new Promise((resolve, reject) => {
    db.run("DELETE FROM movies", (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

/**
 * Testes para quando EXISTEM filmes vencedores.
 */
describe("GET /api/movies/awards/intervals - com vencedores", () => {
  beforeEach(async () => {
    // Insere filmes vencedores
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO movies (year, title, studios, producers, winner)
         VALUES (2000, 'Filme A', 'Studio A', 'Produtor X', 'yes')`,
        (err) => {
          if (err) return reject(err);

          db.run(
            `INSERT INTO movies (year, title, studios, producers, winner)
             VALUES (2010, 'Filme B', 'Studio B', 'Produtor X', 'yes')`,
            (err2) => {
              if (err2) return reject(err2);
              resolve();
            }
          );
        }
      );
    });
  });

  test("Deve retornar os produtores com maior e menor intervalo entre prêmios", async () => {
    // Verifica se realmente há filmes no banco
    db.all("SELECT * FROM movies", [], (err, rows) => {
      console.log("DEBUG - Filmes no banco de dados:", rows);
    });

    // Chama a rota COMPLETA (com '/api')
    const response = await request(app).get("/api/movies/awards/intervals");
    console.log("DEBUG - Resposta da API:", response.body);

    // Verifica se status é 200 ou 404 (depende da sua implementação)
    expect([200, 404]).toContain(response.status);

    // Se for 200 e tiver vencedores, esperamos min e max com dados
    expect(response.body.min ? response.body.min.length : 0).toBeGreaterThan(0);
    expect(response.body.max ? response.body.max.length : 0).toBeGreaterThan(0);
  });
});

/**
 * Testes para quando NÃO EXISTEM filmes vencedores.
 */
describe("GET /api/movies/awards/intervals - sem vencedores", () => {
  test("Deve retornar lista vazia quando não há vencedores", async () => {
    // Aqui não inserimos nenhum filme 'yes',
    // então a tabela permanece vazia (ou só com 'no').

    const response = await request(app).get("/api/movies/awards/intervals");
    console.log("DEBUG - Resposta da API sem vencedores:", response.body);

    expect([200, 404]).toContain(response.status);
    expect(response.body.min || []).toEqual([]);
    expect(response.body.max || []).toEqual([]);
  });
});
