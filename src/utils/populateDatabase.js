const path = require("path");
const { initializeDatabase } = require("../db/database");
const MovieRepository = require("../repositories/movieRepository");
const CsvService = require("../services/csvService");

/**
 * Cria a tabela 'movies' (caso não exista) e insere os dados do CSV.
 */
async function populateDatabase() {
  try {
    console.log("[INFO] Verificando estrutura do banco de dados...");
    
    // 1. Cria/verifica a tabela 'movies'
    await initializeDatabase();
    console.log("[INFO] Tabela 'movies' criada/verificada com sucesso.");

    // 2. Lê o CSV
    const csvFilePath = path.join(__dirname, "../../data/movies.csv"); 
    // Ajuste o nome e caminho do CSV conforme sua estrutura
    const csvService = new CsvService(csvFilePath);
    const movies = await csvService.loadCSV();

    // 3. Insere os filmes
    const movieRepository = new MovieRepository();
    await movieRepository.insertMovies(movies);
    console.log(`[INFO] Total de filmes lidos do CSV: ${movies.length}`);

  } catch (error) {
    console.error("[ERROR] Ocorreu um erro ao popular o banco de dados:", error);
    throw error; // re-lança para o .catch do server.js
  }
}

module.exports = populateDatabase;
