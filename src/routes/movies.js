const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/movieController");

// Criar uma instância corretamente
const movieController = new MovieController();

/**
 * Rota para obter os produtores com maior e menor intervalo entre prêmios consecutivos.
 */
router.get("/awards/intervals", movieController.getProducersAwards);

module.exports = router;
