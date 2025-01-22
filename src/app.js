const express = require("express");
const cors = require("cors");
const movieRoutes = require("./routes/movies");

const app = express();
app.use(cors());
app.use(express.json());

// Montando suas rotas em /api/movies
app.use("/api/movies", movieRoutes);

module.exports = app;
