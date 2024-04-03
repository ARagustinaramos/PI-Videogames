import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGames,
  getGenres,
  setFirstMount,
  getPlatforms,
  setCurrentPage,
  filterGames,
  order,
} from "../actions";

import Cards from "./Cards";
import SearchBar from "./SearchBar";
import NavBar from "./NavBar";

import s from "./Home.module.css";

export default function Home() {
  const dispatch = useDispatch();

  const games = useSelector((state) => state.games);
  const firstMount = useSelector((state) => state.firstMount);
  const allGenres = useSelector((state) => state.genres);
  const allPlatforms = useSelector((state) => state.platforms);
  const [orden, setOrden] = useState("");
  const [filter, setFilter] = useState({
    platform: "all",
    genre: "all",
    source: "all",
  });

  useEffect(() => {
    if (firstMount) {
      dispatch(setCurrentPage(1));
      dispatch(setFirstMount(false));
      dispatch(getGenres());
      dispatch(getGames());
      dispatch(getPlatforms());
    } else {
      dispatch(filterGames(filter));
    }
  }, [dispatch, filter]);

  function handleFilter(e) {
    e.preventDefault();
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
    dispatch(setCurrentPage(1));
  }

  function handleSortName(e) {
    e.preventDefault();
    dispatch(order(["name", e.target.value]));
    dispatch(setCurrentPage(1));
    setOrden(`Order by name: ${e.target.value}`);
  }

  function handleSortRating(e) {
    e.preventDefault();
    dispatch(order(["rating", e.target.value]));
    dispatch(setCurrentPage(1));
    setOrden(`Order by rating: ${e.target.value}`);
  }

  return (
    <div>
      <NavBar />
      <div className={s.main}>
        <div className={s.order_filter_search}>
          <div className={s.filter}>
            <h2>FILTER</h2>
            <div>
              <p>Platforms</p>
              <select
                onChange={(e) => handleFilter(e)}
                name="platform"
                disabled={games.length === 0 ? true : false}
              >
                <option value="all">All</option>
                {allPlatforms?.map((p, i) => (
                  <option value={p} key={i}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p>Genre</p>
              <select
                onChange={(e) => handleFilter(e)}
                name="genre"
                disabled={games.length === 0 ? true : false}
              >
                <option value="all">All</option>
                {allGenres?.map((g, i) => (
                  <option value={g} key={i}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p>Source</p>
              <select
                onChange={(e) => handleFilter(e)}
                name="source"
                disabled={games.length === 0 ? true : false}
              >
                <option value="all">All</option>
                <option value="api">API</option>
                <option value="created">CREATED</option>
              </select>
            </div>
          </div>

          <div className={s.order}>
            <h2>ORDER</h2>
            <div>
              <p>Order by name</p>
              <select
                onChange={(e) => handleSortName(e)}
                defaultValue="-"
                disabled={games.length === 0 ? true : false}
              >
                <option disabled>-</option>
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>

            <div>
              <p>Order by rating</p>
              <select
                onChange={(e) => handleSortRating(e)}
                defaultValue="-"
                disabled={games.length === 0 ? true : false}
              >
                <option disabled>-</option>
                <option value="asc">Asc</option>
                <option value="desc">Des</option>
              </select>
            </div>
            {<p>{orden}</p>}
          </div>

          <div className={s.search}>
            <h2>SEARCH</h2>
            <SearchBar />
          </div>
        </div>

        <div className={s.gameList}>
          <Cards />
        </div>
      </div>
    </div>
  );
}
