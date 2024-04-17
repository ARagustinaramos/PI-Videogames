import React from "react";
import { useSelector } from "react-redux";
import "./Paginado.css";

export default function Paginado({ gamesPerPage, allGames, paginado }) {
  const pages = Math.ceil(allGames / gamesPerPage);
  const pageNumbers = [];

  const currentPage = useSelector((state) => state.currentPage);

  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      
      <div className="paginado">
        {currentPage - 1 > 0 ? (
          <p onClick={() => paginado(currentPage - 1)} className="next_previous">
            previous
          </p>
        ) : null}
        {pageNumbers &&
          pageNumbers.map((number, i) => (
            <button
              key={i}
              onClick={() => paginado(number)}
              className={number === currentPage ? "current" : ""}
            >
              {number}
            </button>
          ))}
        {pages > currentPage ? (
          <p onClick={() => paginado(currentPage + 1)} className="next_previous">
            next
          </p>
        ) : null}
      </div>
    </nav>
  );
}
