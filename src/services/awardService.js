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
        console.log("DEBUG - Lista de vencedores extraída do banco:", winners);
        
        if (!winners || winners.length === 0) {
            console.warn("[WARN] Nenhum produtor vencedor encontrado no banco.");
            return { min: [], max: [] };
        }

        const producerWins = {};

        // Agrupar vitórias por produtor
        winners.forEach(({ producers, year }) => {
            const yearInt = parseInt(year, 10);
            if (isNaN(yearInt)) {
                console.warn(`[WARN] Ano inválido ignorado: ${year}`);
                return;
            }

            // Divide corretamente múltiplos produtores
            const producerList = producers
                .split(/\s*,\s*|\s+and\s+/) // Divide por vírgula ou "and"
                .map(p => p.trim())
                .filter(p => p.length > 0); // Remove strings vazias

            producerList.forEach(producer => {
                if (!producerWins[producer]) {
                    producerWins[producer] = [];
                }
                producerWins[producer].push(yearInt);
            });
        });

        const intervals = [];

        // Calcular intervalos entre prêmios consecutivos
        Object.keys(producerWins).forEach(producer => {
            const years = [...new Set(producerWins[producer])].sort((a, b) => a - b);

            console.log(`DEBUG - ${producer}: Anos ordenados ${years}`);

            if (years.length < 2) {
                console.warn(`[INFO] Produtor ${producer} tem apenas uma vitória.`);
                return;
            }

            for (let i = 1; i < years.length; i++) {
                const intervalo = years[i] - years[i - 1];
                console.log(`DEBUG - ${producer}: Intervalo de ${intervalo} anos entre ${years[i-1]} e ${years[i]}`);
                
                intervals.push({
                    producer,
                    interval: intervalo,
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
