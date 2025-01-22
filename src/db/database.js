const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("[DATABASE] Erro ao conectar ao banco de dados em memória:", err);
  } else {
    console.info("[DATABASE] Banco de dados em memória conectado com sucesso.");
  }
});

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS movies (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         year INTEGER NOT NULL,
         title TEXT NOT NULL,
         studios TEXT NOT NULL,
         producers TEXT NOT NULL,
         winner TEXT NOT NULL CHECK (winner IN ('yes', 'no'))
       )`,
      (err) => {
        if (err) {
          console.error("[DATABASE] Erro ao criar/verificar tabela 'movies':", err);
          return reject(err);
        }
        console.info("[DATABASE] Tabela 'movies' verificada/criada com sucesso.");
        resolve();
      }
    );
  });
}

module.exports = { db, initializeDatabase };
