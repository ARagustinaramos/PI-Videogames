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
} from "../../actions/index";

import Cards from "../Cards/Cards"
import SearchBar from "../SerchBar/SearchBar";
import NavBar from "../NavBar/NavBar";
import "./Homepage.css";

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
  }, [dispatch, filter, firstMount]);
  
  function handleFilter(e) {
    e.preventDefault();
    const newFilter = {
      ...filter,
      [e.target.name]: e.target.value,
    };
    console.log("New filter:", newFilter);
    setFilter(newFilter);
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
      <div className="homePage">
        <NavBar />
        <div className="content">
          <div className="order_filter_search">
            <div className="filter">
              <h2 style={{ color: "blue" }}>FILTER</h2>
              <div>
                <p style={{ color: "green" }}>Platforms</p>
                <select
                  onChange={(e) => handleFilter(e)}
                  name="platform"
                  disabled={games.length === 0 ? true : false}
                  value={filter.platform}
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
                <p style={{ color: "green" }}>Genre</p>
                <select
                  onChange={(e) => handleFilter(e)}
                  name="genre"
                  disabled={games.length === 0 ? true : false}
                  value={filter.genre}
                >
                  <option value="all">All</option>
                  {Array.isArray(allGenres) &&
                     allGenres.map((g, i) => (
                    <option key={i} value={g}>
                       {g}
                     </option>
                     ))}
                </select>
              </div>

              <div>
                <p style={{ color: "green" }}>Source</p>
                <select
                  onChange={handleFilter}
                  name="source"
                  disabled={games.length === 0 ? true : false}
                  value={filter.source}
                >
                  <option value="all" key="all">All</option>
                  <option value="api" key="api">API</option>
                  <option value="created" key="created">CREATED</option>
                </select>
              </div>
            </div>

            <div className="order">
              <h2 style={{ color: "blue" }}>ORDER</h2>
              <div>
                <p style={{ color: "green" }}>Order by name</p>
                <select
                  onChange={(e) => handleSortName(e)}
                  value={orden}
                  disabled={games.length === 0 ? true : false}
                >
                  <option value="-" disabled>-</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </div>
              <div>
                <p style={{ color: "green" }}>Order by rating</p>
                <select
                  onChange={(e) => handleSortRating(e)}
                  value={orden}
                  disabled={games.length === 0 ? true : false}
                >
                  <option value="-" disabled>-</option>
                  <option value="asc">Asc</option>
                  <option value="desc">Des</option>
                </select>
              </div>
              <p>{orden}</p>
            </div>

            <div className="search">
              <h2 style={{ color: "blue" }}>SEARCH</h2>
              <SearchBar />
            </div>
          </div>
        </div>
        <div className="gameList">
          <Cards />
        </div>
      </div>
    </div>
  );
}