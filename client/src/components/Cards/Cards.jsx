import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./Cards.css";
import Card from "../Card/Card";
import Paginado from "../Paginado/paginado";
import { setCurrentPage } from "../../actions";

export default function Cards() {
  const allGames = useSelector((state) => state.games);
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();
  const gamesPerPage = 15;
  const lastGameIndex = currentPage * gamesPerPage;
  const firstGameIndex = lastGameIndex - gamesPerPage;
  const currentGames = allGames.slice(firstGameIndex, lastGameIndex);

  const paginado = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
  };

  if (
    allGames.length === 0 ||
    (allGames.length === 1 && allGames[0] === "empty")
  ) {
    return <p>No Games</p>;
  }

  return (
    <div>
      <h1 style={{ color: "green" }}>Games List</h1>
      {allGames.length > 0 && allGames[0] !== "empty" ? (
        <div>
          <div className="list">
            {currentGames?.map((g, i) => (
              <div key={i}>
                
                <Link to={"/videogames/" + g.id}>
                  <Card
                    name={g.name}
                    image={g.image}
                    rating={g.rating}
                    genres={g.genres}
                  />
                </Link>
              </div>
            ))}
          </div>
          <Paginado
            gamesPerPage={gamesPerPage}
            allGames={allGames.length}
            paginado={paginado}
          />
        </div>
      ) : allGames[0] === "empty" ? (
        <p>No Games</p>
      ) : (
        <div className="loading"></div>
      )}
    </div>
  );
}