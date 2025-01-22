const { db } = require("../db/database");

/**
 * Repositório responsável por operações no banco de dados.
 */
class MovieRepository {
    constructor() {
        console.info("[MovieRepository] Inicializado.");
    }

    /**
     * Obtém todos os filmes armazenados no banco de dados.
     * @returns {Promise<Array>} Lista de filmes.
     */
    async getAllMovies() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM movies", [], (err, rows) => {
                if (err) {
                    console.error("[MovieRepository] Erro ao buscar filmes:", err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Obtém todos os filmes vencedores da categoria "Pior Filme".
     * @returns {Promise<Array>} Lista de filmes vencedores.
     */
    async getWinningMovies() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM movies WHERE winner = 'yes'", [], (err, rows) => {
                if (err) {
                    console.error("[MovieRepository] Erro ao buscar filmes vencedores:", err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Obtém os produtores vencedores da categoria "Pior Filme".
     * @returns {Promise<Array>} Lista de produtores vencedores e anos de vitória.
     */
    async getWinningProducers() {
        return new Promise((resolve, reject) => {
            db.all("SELECT year, producers FROM movies WHERE winner = 'yes'", [], (err, rows) => {
                if (err) {
                    console.error("[MovieRepository] Erro ao buscar produtores vencedores:", err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Insere uma lista de filmes no banco de dados.
     * @param {Array<Object>} movies - Lista de objetos contendo os dados dos filmes.
     * @returns {Promise<void>}
     */
    async insertMovies(movies) {
        if (!movies || movies.length === 0) {
            console.warn("[MovieRepository] Nenhum filme para inserir.");
            return;
        }

        return new Promise((resolve, reject) => {
            const stmt = db.prepare("INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)");

            movies.forEach(movie => {
                if (!movie.title) {
                    console.warn("[MovieRepository] Filme sem título ignorado:", movie);
                    return;
                }

                stmt.run(
                    movie.year,
                    movie.title,
                    movie.studios || "Desconhecido",
                    movie.producers || "Desconhecido",
                    movie.winner || "no",
                    (err) => {
                        if (err) {
                            console.error("[MovieRepository] Erro ao inserir filme:", err);
                            reject(err);
                        }
                    }
                );
            });

            stmt.finalize((err) => {
                if (err) {
                    console.error("[MovieRepository] Erro ao finalizar inserção:", err);
                    reject(err);
                } else {
                    console.info(`[MovieRepository] ${movies.length} filmes inseridos com sucesso.`);
                    resolve();
                }
            });
        });
    }
}

module.exports = MovieRepository;
