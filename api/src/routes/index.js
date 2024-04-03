const { Router } = require('express');
const router = Router();

var videogamesRoutes = require ("./videogames");
var genresRoutes = require ("./genre");

router.use("/videogames", videogamesRoutes);
router.use("/genre", genresRoutes);



module.exports = router;
