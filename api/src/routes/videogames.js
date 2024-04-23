const express = require("express");
const router = express.Router();

const axios = require("axios");
const { Videogame, Genre, videogame_genre } = require("../db");

const { APIKEY } = process.env;


// Search API games
const getAllApiGames = async () => {
  try {
    let games = [];
    for (let i = 1; i < 6; i++) {
      const pages = await axios.get(
        `https://api.rawg.io/api/games?key=${APIKEY}&page=${i}`
      );
      console.log("API Response:", pages.data);
      const pageGames = pages.data.results.map((el) => ({
        id: el.id,
        name: el.name,
        image: el.background_image,
        released: el.released,
        rating: el.rating,
        platforms: el.platforms.map((p) => p.platform.name),
        genres: el.genres.map((g) => g.name),
      }));
      games = games.concat(pageGames);
    }
    return games;
  } catch (error) {
    console.error("Error al obtener los juegos de la API:", error);
    throw new Error("Error al obtener los juegos de la API");
  }
};

// Search DataBase games
async function getDbGames() {
  try {
    // Recuperar los juegos de la base de datos
    const games = await Videogame.findAll();
    console.log("DB Games:", games);
    // Verificar si se recuperaron juegos
    if (!games) {
      return []; // Devolver un arreglo vacío si no se encontraron juegos
    }

    // Mapear los juegos para obtener solo los datos necesarios
    const formattedGames = games.map((game) => ({
      id: game.id,
      name: game.name,
      description: game.description,
      image: game.image, 
      released: game.released, 
      rating: game.rating, 
      createdInDb : game.createdInDb,
      genres: game.genre,
      platforms: game.platform,
    
    }));

    return formattedGames;
  } catch (error) {
    console.error("Error al obtener los juegos de la base de datos:", error);
    throw new Error("Error al obtener los juegos de la base de datos");
  }
}


// Search All games
const getAllGames = async () => {
  const apiGames = await getAllApiGames();
  const dbGames = await getDbGames();
  const totalGames = apiGames.concat(dbGames);
  return totalGames;
};

router.get("/videogames", async (req, res) => {
  const { source } = req.query;
  console.log("Source:", source);

  try {
    let games;

    if (source === "CREATED") {
      console.log("Filtering by CREATED");
      // Si el filtro por "Source" es "CREATED", obtener solo los juegos creados manualmente
      games = await Videogame.findAll({
        where: { createdInDb: true },
        include: [{ model: Genre }],
      });
    } else {
      console.log("Getting all games");
      // Si no se aplica ningún filtro por "Source", obtener todos los juegos
      games = await getAllGames();
    }

    console.log("Filtered games:", games);
    res.status(200).json(games);
  } catch (error) {
    console.error("Error while getting all games:", error);
    res.status(500).send("Error while getting all games");
  }
});

// Search API game by id
// https://api.rawg.io/api/games/{id}
const getApiGameId = async (id) => {
  const game = await axios.get(
    `https://api.rawg.io/api/games/${id}?key=${APIKEY}`
  );
  return {
    name: game.data.name,
    description: game.data.description_raw,
    image: game.data.background_image,
    released: game.data.released,
    rating: game.data.rating,
    platforms: game.data.platforms.map((p) => p.platform.name),
    genres: game.data.genres.map((p) => p.name),
  };
};

// Search game by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let game;
    if (Number(id)) {
      game = await getApiGameId(id);
    } else {
      game = (await getDbGames()).find((g) => g.id === id);
    }
    game ? res.status(200).json(game) : res.status(404).send("NOT FOUND");
  } catch (error) {
    console.error("Error al obtener el juego por ID:", error);
    res.status(500).send("Error al obtener el juego por ID");
  }
});

// Search all games or game by name
router.get("/", async (req, res) => {
  try {
    let games = await getAllGames();
    const name = req.query.name;
    if (name) {
      games = games.filter((e) =>
        e.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    games.length
      ? res.status(200).json(games)
      : res.status(404).send("game not found");
  } catch (error) {
    console.error("Error al obtener todos los juegos:", error);
    res.status(500).send("Error al obtener todos los juegos");
  }
});

// Delete game by id
router.delete("/delete/:idgame", async (req, res) => {
  const { idgame } = req.params;

  try {
    await Videogame.destroy({
      where: { id: idgame },
    });
    res.status(200).send("Game deleted");
  } catch (e) {
    console.log(e);
  }
});


// Update game by id
router.put("/update", async (req, res) => {
  const { id, name, description, image, released, rating, platforms, genres } = req.body;

  try {
    // Actualizar el juego en la base de datos
    await Videogame.update(
      { name, description, image, released, rating, platforms },
      { where: { id } }
    );

    // Buscar los géneros en la base de datos
    const genreDb = await Genre.findAll({ where: { name: genres } });

    // Eliminar los géneros asociados al juego
    await game_genre.destroy({ where: { videogameId: id } });

    // Obtener el juego actualizado
    const game = await Videogame.findByPk(id);

    // Agregar los nuevos géneros al juego
    await game.addGenres(genreDb);

    res.status(200).send("Game Updated");
  } catch (error) {
    console.error("Error while updating game:", error);
    res.status(500).send("Error while updating game");
  }
});


// Add game
router.post("/add", async (req, res) => {
  const { name, description, image, released, rating, platforms, genres } = req.body;

  try {
   
    const platformsString = Array.isArray(platforms) ? platforms.join(", ") : platforms;
    const gameCreated = await Videogame.create({
      name,
      description,
      image,
      released,
      rating,
      platforms: platformsString, 
    });

    // Buscar los géneros en la base de datos
    const genreDb = await Genre.findAll({ where: { name: genres } });

    // Agregar los géneros al juego creado
    await gameCreated.addGenres(genreDb);

    res.status(201).json({ message: "Game created successfully", game: gameCreated });
  } catch (error) {
    console.error("Error while creating game:", error);
    res.status(500).send("Error while creating game");
  }
});


module.exports = router;