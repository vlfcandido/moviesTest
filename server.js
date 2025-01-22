require("dotenv").config();
const app = require("./src/app");
const populateDatabase = require("./src/utils/populateDatabase");

const PORT = process.env.PORT || 3000;

populateDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
});
