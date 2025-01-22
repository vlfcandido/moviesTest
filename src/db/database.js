const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho do banco de dados
const dbPath = path.join(__dirname, "../../data/movies.db");

// Inicializa o banco de dados SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("[DATABASE] Erro ao conectar ao banco de dados:", err);
    } else {
        console.info("[DATABASE] Banco de dados conectado com sucesso.");
    }
});

/**
 * Inicializa o banco de dados criando a tabela caso não exista.
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                title TEXT NOT NULL,
                studios TEXT NOT NULL,
                producers TEXT NOT NULL,
                winner TEXT NOT NULL CHECK (winner IN ('yes', 'no'))
            )
        `, (err) => {
            if (err) {
                console.error("[DATABASE] Erro ao criar tabela:", err);
                reject(err);
            } else {
                console.info("[DATABASE] Tabela 'movies' verificada/criada com sucesso.");
                resolve();
            }
        });
    });
}

module.exports = { db, initializeDatabase };
