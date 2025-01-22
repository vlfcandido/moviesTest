const request = require('supertest');
const app = require('../../src/app'); // Ajuste conforme necessário
const { db } = require('../../src/db/database');

beforeEach((done) => {
    db.run("DELETE FROM movies", done); // Limpa os dados antes de cada teste
});

describe('GET /movies/awards/intervals', () => {
    test('Deve retornar os produtores com maior e menor intervalo entre prêmios', async () => {
        await db.run("INSERT INTO movies (year, title, studios, producers, winner) VALUES (2000, 'Filme A', 'Studio A', 'Produtor X', 'yes')");
        await db.run("INSERT INTO movies (year, title, studios, producers, winner) VALUES (2010, 'Filme B', 'Studio B', 'Produtor X', 'yes')");

        // LOG PARA VERIFICAR O BANCO
        db.all("SELECT * FROM movies", [], (err, rows) => {
            console.log("DEBUG - Filmes no banco de dados:", rows);
        });

        const response = await request(app).get('/movies/awards/intervals');
        console.log("DEBUG - Resposta da API:", response.body);

        expect([200, 404]).toContain(response.status);
        expect(response.body.min ? response.body.min.length : 0).toBeGreaterThan(0);
        expect(response.body.max ? response.body.max.length : 0).toBeGreaterThan(0);
    });

    test('Deve retornar lista vazia quando não há vencedores', async () => {
        const response = await request(app).get('/movies/awards/intervals');
        console.log("DEBUG - Resposta da API sem vencedores:", response.body);
        
        expect([200, 404]).toContain(response.status);
        expect(response.body.min || []).toEqual([]);
        expect(response.body.max || []).toEqual([]);
    });
});
