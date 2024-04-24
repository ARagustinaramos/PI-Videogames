import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postGame, setFirstMount } from "../../actions";
import NavBar from "../NavBar/NavBar";
import "./GameCreate.css";

export default function GameCreate() {
  const dispatch = useDispatch();
  const allGenres = useSelector((state) => state.genres);
  const allPlatforms = useSelector((state) => state.platforms);
  const history = useHistory();

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    platforms: "",
  });

  const [inputDisabled, setInputDisabled] = useState(true);

  const [input, setInput] = useState({
    name: "",
    description: "",
    image: "",
    released: "2000-01-01",
    rating: "",
    platforms: [],
    genres: [],
  });

  useEffect(() => {
    function validateForm() {
      let errors = {};
      if (!input.name) errors.name = "Name is required";
      if (!input.description) errors.description = "Description is required";
      if (input.platforms.length === 0) errors.platforms = "Platforms are required";
      setInputDisabled(Object.keys(errors).length !== 0);
      setErrors(errors);
    }

    validateForm(); // Llamamos a la función dentro del useEffect
  }, [input]); // Dependencia del useEffect

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  }

  function handleSelectPlatform(e) {
    const selectedPlatform = e.target.value;
    if (!input.platforms.includes(selectedPlatform)) {
      setInput({
        ...input,
        platforms: [...input.platforms, selectedPlatform],
      });
    }
  }

  function handleDeletePlatform(platform) {
    setInput({
      ...input,
      platforms: input.platforms.filter((p) => p !== platform),
    });
  }

  function handleSelectGenre(e) {
    const selectedGenre = e.target.value;
    setInput({
      ...input,
      genres: [...input.genres, selectedGenre],
    });
  }

  function handleDeleteGenre(genre) {
    setInput({
      ...input,
      genres: input.genres.filter((g) => g !== genre),
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(setFirstMount(true));
    dispatch(
      postGame({
        ...input,
        rating: input.rating === "" ? 0 : input.rating,
      })
    ).then(() => {
      alert("Game Created");
      history.push("/videogames"); 
    });
  }
  

  return (
    <div>
      <NavBar />
      <div className="main">
        <form onSubmit={(e) => handleSubmit(e)} className="form">
          <h1 style={{ color: "blue" }}>Create Game</h1>
          <div>
            <p>Name* (max 40 characters)</p>
            <input
              type="text"
              value={input.name}
              name="name"
              onChange={(e) => handleChange(e)}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div>
            <p>Description* (max 300 characters)</p>
            <textarea
              value={input.description}
              name="description"
              cols="30"
              rows="5"
              onChange={(e) => handleChange(e)}
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
          <div>
            <p>Image (url) </p>
            <input
              type="text"
              value={input.image}
              name="image"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <p>Released </p>
            <input
              type="date"
              value={input.released}
              name="released"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <p>Rating (0-5 two decimals) </p>
            <input
              type="text"
              value={input.rating}
              name="rating"
              onChange={(e) => handleChange(e)}
            />
            {errors.rating && <span className="error">{errors.rating}</span>}
          </div>
          <div>
            <p>Platforms* </p>
            <select
              value={input.platforms}
              onChange={(e) => handleSelectPlatform(e)}
              multiple
            >
              <option value="" disabled hidden>
                Select platform
              </option>
              {Array.isArray(allPlatforms) &&
                allPlatforms.map((platform, i) => (
                  <option key={i} value={platform}>
                    {platform}
                  </option>
                ))}
            </select>
            {errors.platforms && (
              <span className="error">{errors.platforms}</span>
            )}
          </div>
  
          <ul>
            {input.platforms.map((platform, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleDeletePlatform(platform)}
                >
                  X
                </button>
                <p>{platform}</p>
              </li>
            ))}
          </ul>
  
          <div>
            <p>Genres </p>
            <select
              value={input.genres}
              onChange={(e) => handleSelectGenre(e)}
              multiple
            >
              <option value="" disabled hidden>
                Select genres
              </option>
              {Array.isArray(allGenres) &&
                allGenres.map((genre, i) => (
                  <option key={i} value={genre}>
                    {genre}
                  </option>
                ))}
            </select>
          </div>
          {input.genres && input.genres.length > 0 ? (
            <ul>
              {input.genres.map((genre, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleDeleteGenre(genre)}
                  >
                    X
                  </button>
                  <p>{genre}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No genres selected</p>
          )}
  
          <button disabled={inputDisabled} type="submit" className="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
