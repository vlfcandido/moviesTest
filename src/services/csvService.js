const fs = require("fs");
const csvParser = require("csv-parser");

class CsvService {
    constructor(csvFilePath) {
        this.csvFilePath = csvFilePath;
    }

    /**
     * Lê o arquivo CSV e retorna uma lista de objetos representando os filmes.
     * @returns {Promise<Array>} Lista de filmes processados a partir do CSV.
     */
    async loadCSV() {
        return new Promise((resolve, reject) => {
            const movies = [];

            fs.createReadStream(this.csvFilePath)
                .pipe(csvParser({ separator: ";" })) // Confirma que o separador correto está sendo usado
                .on("data", (row) => {
                    // Normaliza e valida os dados antes de adicionar à lista
                    const year = row.year ? parseInt(row.year.trim(), 10) : null;
                    const title = row.title ? row.title.trim() : null;
                    const studios = row.studios ? row.studios.trim() : "Desconhecido";
                    const producers = row.producers ? row.producers.trim() : "Desconhecido";
                    const winner = row.winner && row.winner.toLowerCase() === "yes" ? "yes" : "no";

                    // Se qualquer campo essencial estiver ausente, ignoramos a linha
                    if (!year || !title) {
                        console.warn("[WARN] Linha ignorada por conter dados inválidos:", row);
                        return;
                    }

                    movies.push({ year, title, studios, producers, winner });
                })
                .on("end", () => {
                    console.log(`[INFO] Total de filmes processados: ${movies.length}`);
                    resolve(movies);
                })
                .on("error", (error) => {
                    console.error("[ERROR] Erro ao ler CSV:", error);
                    reject(error);
                });
        });
    }
}

module.exports = CsvService;
