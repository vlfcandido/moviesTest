const AwardService = require("../services/awardService");
const MovieRepository = require("../repositories/movieRepository"); // Adicionado

/**
 * Controlador responsável por gerenciar requisições relacionadas a filmes.
 */
class MovieController {
    constructor() {
        this.awardService = new AwardService();
        this.movieRepository = new MovieRepository(); // Adicionado

        this.getProducersAwards = this.getProducersAwards.bind(this);
        this.getAllMovies = this.getAllMovies.bind(this); // Certifique-se de vincular corretamente
    }

    /**
     * Obtém os produtores com maior e menor intervalo entre prêmios consecutivos.
     */
    async getProducersAwards(req, res) {
        try {
            console.log("[INFO] Requisição recebida: GET /movies/awards/intervals");
            console.log("[INFO] Iniciando processamento para calcular prêmios...");

            const result = await this.awardService.getProducerAwardIntervals();

            console.log("[INFO] Cálculo de prêmios concluído.");
            console.log(`[INFO] Menor intervalo: ${result.min.length} registros`);
            console.log(`[INFO] Maior intervalo: ${result.max.length} registros`);

            res.status(200).json(result);
        } catch (error) {
            console.error("[ERROR] Erro ao calcular prêmios dos produtores:", error);
            res.status(500).json({ error: "Erro ao calcular prêmios dos produtores." });
        }
    }

    /**
     * Obtém todos os filmes do banco de dados.
     */
    async getAllMovies(req, res) {
        try {
            console.log("[INFO] Requisição recebida: GET /movies");
            const movies = await this.movieRepository.getAllMovies();

            if (!movies || movies.length === 0) {
                console.warn("[WARN] Nenhum filme encontrado no banco de dados.");
                return res.status(404).json({ error: "Nenhum filme encontrado." });
            }

            console.log(`[INFO] Total de filmes retornados: ${movies.length}`);
            res.status(200).json(movies);
        } catch (error) {
            console.error("[ERROR] Erro ao buscar filmes:", error);
            res.status(500).json({ error: "Erro ao buscar filmes." });
        }
    }
}

module.exports = MovieController;
