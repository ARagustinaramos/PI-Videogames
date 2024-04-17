const { Router } = require("express");
const router = Router();

const axios = require("axios");
const { Genre } = require("../db");
const { APIKEY } = process.env;

// Función para obtener los géneros de la API o la base de datos
const getGenres = async () => {
  try {
    let allGenres = await Genre.findAll({ attributes: ["name"] });

    if (!allGenres.length) {
      const apiResult = await axios.get(
        `https://api.rawg.io/api/genres?key=${APIKEY}`
      );

      const genresData = apiResult.data.results.map((g) => ({
        name: g.name,
      }));

      // Usamos el método bulkCreate para evitar múltiples consultas
      await Genre.bulkCreate(genresData);
      
      allGenres = genresData.map((g) => g.name);
    } else {
      allGenres = allGenres.map((g) => g.name);
    }

    return allGenres;
  } catch (error) {
    console.error("Error al obtener los géneros:", error);
    throw new Error("Error al obtener los géneros");
  }
};

// Ruta para obtener todos los géneros
router.get("/", async (req, res) => {
  try {
    const allGenres = await getGenres();
    res.json(allGenres);
  } catch (error) {
    res.status(500).send("Error al obtener los géneros");
  }
});

module.exports = router;
