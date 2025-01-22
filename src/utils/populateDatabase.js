const path = require("path");
const CsvService = require("../services/csvService");
const MovieRepository = require("../repositories/movieRepository");

const csvFilePath = path.join(__dirname, "../../data/movies.csv");

/**
 * Popula o banco de dados lendo e processando os dados do CSV.
 */
async function populateDatabase() {
    try {
        const movieRepository = new MovieRepository();
        console.log("[INFO] Verificando estrutura do banco de dados...");

        const csvService = new CsvService(csvFilePath);
        const movies = await csvService.loadCSV();

        console.log(`[INFO] Total de filmes lidos do CSV: ${movies.length}`);

        if (movies.length > 0) {
            await movieRepository.insertMovies(movies);
            console.log("[INFO] Banco de dados populado com sucesso.");
        } else {
            console.warn("[WARN] Nenhum filme válido foi encontrado no CSV.");
        }
    } catch (error) {
        console.error("[ERROR] Erro ao popular banco:", error);
    }
}

module.exports = populateDatabase;
