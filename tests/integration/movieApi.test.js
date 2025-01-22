const request = require("supertest");
const app = require("../../src/app");

describe("API de Filmes e Prêmios", () => {
    describe("GET /movies", () => {
        it("Deve retornar status 200 e uma lista de filmes", async () => {
            const res = await request(app).get("/api/movies");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe("GET /movies/awards/intervals", () => {
        it("Deve retornar status 200 e a estrutura correta", async () => {
            const res = await request(app).get("/api/movies/awards/intervals");
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("min");
            expect(res.body).toHaveProperty("max");
        });
    });
});
