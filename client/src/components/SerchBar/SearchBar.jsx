import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getNameGame, getGames } from "../actions";

//import s from "./SearchBar.module.css";

export default function SearchBar() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  const re = /^[0-9a-zA-ZÁ-ÿ.:-\s]{0,40}$/;

  function handlerInputChange(e) {
    e.preventDefault();
    setName(e.target.value);
    if (!re.exec(e.target.value)) {
      e.target.value.length > 40
        ? setError("Invalid Length")
        : setError("Invalid Characters");
      setInputDisabled(true);
    } else {
      setError("");
      setInputDisabled(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (name) {
      dispatch(getNameGame(name));
      setError("");
      setName("");
      setInputDisabled(false);
    } else {
      dispatch(getGames());
    }
  }

  return (
    <div className={s.search}>
      <input
        className={s.input}
        type="text"
        placeholder="Search by name"
        value={name}
        onChange={(e) => handlerInputChange(e)}
      />
      {error && <p className={s.error}>{error}</p>}
      <button
        disabled={inputDisabled}
        className={s.button}
        type="submit"
        onClick={(e) => handleSubmit(e)}
      >
        Search
      </button>
    </div>
  );
}
