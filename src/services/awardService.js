const MovieRepository = require("../repositories/movieRepository");

/**
 * Serviço responsável por calcular estatísticas de prêmios dos produtores.
 */
class AwardService {
    constructor() {
        this.movieRepository = new MovieRepository();
    }

    /**
     * Obtém os produtores com maior e menor intervalo entre dois prêmios consecutivos.
     * @returns {Promise<Object>} Objeto contendo os produtores com os maiores e menores intervalos.
     */
    async getProducerAwardIntervals() {
        console.log("[INFO] Iniciando análise de prêmios dos produtores...");

        const winners = await this.movieRepository.getWinningProducers();
        if (!winners || winners.length === 0) {
            console.warn("[WARN] Nenhum produtor vencedor encontrado no banco.");
            return { min: [], max: [] };
        }

        const producerWins = {};

        // Agrupar vitórias por produtor
        winners.forEach(({ producers, year }) => {
            const yearInt = parseInt(year, 10);

            // Divide corretamente múltiplos produtores usando vírgula, " and " ou ambos
            const producerList = producers.split(/,\s*| and /).map(p => p.trim());

            producerList.forEach(producer => {
                if (!producerWins[producer]) {
                    producerWins[producer] = [];
                }
                producerWins[producer].push(yearInt);
            });
        });

        const intervals = [];

        // Calcular intervalos entre prêmios consecutivos
        Object.keys(producerWins).forEach((producer) => {
            // Ordenar anos para garantir a precisão da análise
            const years = [...new Set(producerWins[producer])].sort((a, b) => a - b);

            for (let i = 1; i < years.length; i++) {
                intervals.push({
                    producer,
                    interval: years[i] - years[i - 1],
                    previousWin: years[i - 1],
                    followingWin: years[i],
                });
            }
        });

        if (intervals.length === 0) {
            console.warn("[WARN] Nenhum produtor teve múltiplos prêmios consecutivos.");
            return { min: [], max: [] };
        }

        const minInterval = Math.min(...intervals.map(i => i.interval));
        const maxInterval = Math.max(...intervals.map(i => i.interval));

        console.log(`[INFO] Análise concluída. Menor intervalo: ${minInterval}, Maior intervalo: ${maxInterval}`);

        return {
            min: intervals.filter(i => i.interval === minInterval),
            max: intervals.filter(i => i.interval === maxInterval),
        };
    }
}

module.exports = AwardService;
