import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

//import s from "./Cards.module.css";

import Card from "./Card";
import Paginado from "./Paginado";

import { setCurrentPage } from "../actions";
// import { all } from "../../../api/src/routes/videogames.js";

export default function Cards() {
  const allGames = useSelector((state) => state.games);
  const currentPage = useSelector((state) => state.currentPage);

  const gamesPerPage = 15;

  const lastGameIndex = currentPage * gamesPerPage;
  const firstGameIndex = lastGameIndex - gamesPerPage;
  const currentGames = allGames.slice(firstGameIndex, lastGameIndex);

  const dispatch = useDispatch();

  const paginado = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
  };

  return (
    <div>
      <h1>Games List</h1>
      {allGames.length > 0 && allGames[0] !== "empty" ? (
        <div>
          <Paginado
            gamesPerPage={gamesPerPage}
            allGames={allGames.length}
            paginado={paginado}
          />
          <div className={s.list}>
            {currentGames?.map((g, i) => {
              return (
                <Link to={"/videogames/" + g.id} key={i}>
                  <div>
                    <Card
                      name={g.name}
                      image={g.image}
                      rating={g.rating}
                      genres={g.genres}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : allGames[0] === "empty" ? (
        <p>No Games</p>
      ) : (
        <div className={s.loading}></div>
      )}
    </div>
  );
}
