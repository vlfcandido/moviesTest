require("dotenv").config();
const app = require("./src/app");
const populateDatabase = require("./src/utils/populateDatabase");

const PORT = process.env.PORT || 3000;

// Passo principal: primeiro, populamos o banco (criar tabela + inserir CSV)
// Só depois que isso estiver concluído, subimos o servidor.
populateDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[ERROR] Falha ao popular o banco:", error);
    process.exit(1); // encerra a aplicação, ou trate como preferir
  });
