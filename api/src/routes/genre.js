const { Router } = require("express");
const router = Router();

const axios = require("axios");
const { Genre } = require("../db");
const { APIKEY } = process.env;


const getGenres = async () => {
  let allGenres = await Genre.findAll({ attributes: ["name"] });

  if (!allGenres.length) {
    apiResult = await axios.get(`https://api.rawg.io/api/genres?key=${APIKEY}`);

    allGenres = apiResult.data.results.map((g) => {
      Genre.findOrCreate({
        where: {
          name: g.name,
        },
      });
      return g.name;
    });
  } else {
    allGenres = allGenres.map((g) => {
      return g.name;
    });
  }

  return allGenres;
};

router.get("/", async (req, res) => {
  const allGenres = await getGenres();
  res.json(allGenres);
});

module.exports = router;