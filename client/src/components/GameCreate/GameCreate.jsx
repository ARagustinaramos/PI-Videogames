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
    name: "Name is required",
    description: "Description is required",
    platforms: "Platforms are required",
  });

  const [inputDisabled, setInputDisabled] = useState(true);
  const [ratingError, setRatingError] = useState("");
  const [releasedError, setReleasedError] = useState("");

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
    const rename = /^[0-9a-zA-ZÁ-ÿ/.:-\s]{0,40}$/;
    const redescription = /^[0-9a-zA-ZÁ-ÿ/.:-\s]{0,300}$/;
    let errors = {};
    if (!input.name) errors.name = "Name is required";
    else if (!rename.exec(input.name)) {
      input.name.length > 40
        ? (errors.name = "Invalid Length")
        : (errors.name = "Invalid Characters");
    } else errors.name = "";

    if (!input.description) errors.description = "Description is required";
    else if (!redescription.exec(input.description)) {
      input.description.length > 300
        ? (errors.description = "Invalid Length")
        : (errors.description = "Invalid Characters");
    } else errors.description = "";

    if (input.platforms.length === 0)
      errors.platforms = "Platforms is required";
    else errors.platforms = "";

    errors.name === "" && errors.description === "" && errors.platforms === ""
      ? setInputDisabled(false)
      : setInputDisabled(true);

    setErrors(errors);
  }, [input.name, input.description, input.platforms]);

  function validateRating() {
    if (Number(input.rating) || input.rating === "") {
      if (input.rating.length <= 4) {
        if (input.rating <= 5 && input.rating >= 0) {
          if (input.rating[0] !== ".") {
            setRatingError("");
            return 1;
          }
        }
      }
    }
    setRatingError("Invalid Value");
    return 0;
  }

  function validateReleased() {
    const date = input.released.split("-");
    if (
      date[0].length !== 4 ||
      !Number(date[0]) ||
      date[0] < 1900 ||
      date[0] > 2100
    ) {
      setReleasedError("Invalid Date");
      return 0;
    }
    if (!Number(date[1]) || date[1] < 1 || date[1] > 12) {
      setReleasedError("Invalid Date");
      return 0;
    }
    if (!Number(date[2]) || date[2] < 1 || date[2] > 31) {
      setReleasedError("Invalid Date");
      return 0;
    }
    setReleasedError("");
    return 1;
  }

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  }

  function handleSelectPlatform(e) {
    const selectedPlatform = e.target.value;
    if (input.platforms.indexOf(selectedPlatform) === -1) {
      setInput({
        ...input,
        platforms: [...input.platforms, selectedPlatform],
      });
    }
  }

  function handleDeletePlatform(e) {
    const deletedPlatform = e.target.name;
    setInput({
      ...input,
      platforms: input.platforms.filter((platform) => platform !== deletedPlatform),
    });
  }

  function handleSelectGenre(e) {
    const selectedGenre = e.target.value;
    if (input.genres.indexOf(selectedGenre) === -1) {
      setInput({
        ...input,
        genres: [...input.genres, selectedGenre],
      });
    }
  }

  function handleDeleteGenre(e) {
    const deletedGenre = e.target.name;
    setInput({
      ...input,
      genres: input.genres.filter((genre) => genre !== deletedGenre),
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const r = validateRating();
    const d = validateReleased();
    if (r && d) {
      dispatch(setFirstMount(true));
      dispatch(
        postGame({
          ...input,
          rating: input.rating === "" ? 0 : input.rating,
        })
      );
      alert("Game Created");
      history.push("/videogames");
    }
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
            {releasedError !== "" ? (
              <span className="error">{releasedError}</span>
            ) : null}
          </div>
          <div>
            <p>Rating (0-5 two decimals) </p>
            <input
              type="text"
              value={input.rating}
              name="rating"
              onChange={(e) => handleChange(e)}
            />
            {ratingError !== "" ? (
              <span className="error">{ratingError}</span>
            ) : null}
          </div>
          <div>
            <p>Platforms* </p>
            <select onChange={(e) => handleSelectPlatform(e)}>
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
                  name={platform}
                  onClick={(e) => handleDeletePlatform(e)}
                >
                  X
                </button>
                <p>{platform}</p>
              </li>
            ))}
          </ul>

          <div>
            <p>Genres </p>
            <select onChange={(e) => handleSelectGenre(e)}>
              <option selected disabled hidden>
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
          name={genre}
          onClick={(e) => handleDeleteGenre(e)}
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