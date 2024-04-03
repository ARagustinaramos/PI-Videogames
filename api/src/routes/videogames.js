var express = require("express");
var router = express.Router();

const axios = require("axios");
const { Videogame, Genre, videogame_genre } = require("../db");

const { APIKEY } = process.env;


// Search API games
const getAllApiGames = async () => {
  let games = [];
  for (let i = 1; i < 6; i++) {
    const pages = await axios.get(
      `https://api.rawg.io/api/games?key=${APIKEY}&page=${i}`
    );
    const pageGames = await pages.data.results.map((el) => {
      return {
        id: el.id,
        name: el.name,
        image: el.background_image,
        released: el.released,
        rating: el.rating,
        platforms: el.platforms.map((p) => p.platform.name),
        genres: el.genres.map((g) => g.name),
      };
    });
    games = games.concat(pageGames);
  }
  return games;
};

// Search DataBase games
const getDbGames = async () => {
  let dbGames = await Videogame.findAll({
    // incluye el modelo genre para poder acceder al nombre y id de los distintos generos
    include: {
      model: Genre,
      // trae name y id (automaticamente)
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
  return dbGames.map((g) => {
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      image: g.image,
      released: g.released,
      rating: g.rating,
      platforms: g.platforms,
      createdInDb: g.createdInDb,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
      genres: g.genres.map((el) => el.name),
    };
  });
};

// Search All games
const getAllGames = async () => {
  const apiGames = await getAllApiGames();
  const dbGames = await getDbGames();
  const totalGames = apiGames.concat(dbGames);
  return totalGames;
};

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
// 5286
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  let game;
  if (Number(id)) {
    game = await getApiGameId(id);
  } else {
    game = (await getDbGames()).find((g) => g.id === id);
  }

  game.length !== 0
    ? res.status(200).json(game)
    : res.status(404).send("NOT FOUND");
});

// Search all games or game by name
router.get("/", async (req, res) => {
  let games = await getAllGames();
  const name = req.query.name;

  if (name) {
    games = await games.filter((e) =>
      e.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  games.length
    ? res.status(200).json(games)
    : res.status(404).send("game not found");
});

// Delete game by id
router.delete("/delete/:idgame", async (req, res) => {
  const { idgame } = req.params;
  // console.log(idgame);
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
  const { id, name, description, image, released, rating, platforms, genres } =
    req.body;

  try {
    await Videogame.update(
      {
        name,
        description,
        image,
        released,
        rating,
        platforms,
      },
      { where: { id } }
    );

    let genreDb = await Genre.findAll({
      where: { name: genres },
    });

    await game_genre.destroy({ where: { videogameId: id } });

    let game = await Videogame.findOne({ where: { id } });
    game.addGenre(genreDb);

    res.status(200).send("Game Updated");
  } catch (e) {
    console.log(e);
  }
});

// Add game
router.post("/add", async (req, res) => {
  const { name, description, image, released, rating, platforms, genres } =
    req.body;

  try {
    let gameCreated = await Videogame.create({
      name,
      description,
      image,
      released,
      rating,
      platforms,
    });

    // busca en el modelo genre todos los que coincidan con los pasados por body
    let genreDb = await Genre.findAll({
      where: { name: genres },
    });

    // addNombreModelo es un metodo de sequelize que trae del modelo (genre) lo que se le pasa
    gameCreated.addGenre(genreDb);

    res.status(200).send("Game Created");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;