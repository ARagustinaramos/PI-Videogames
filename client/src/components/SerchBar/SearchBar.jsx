import React, { useState, useEffect  } from "react";
import { useDispatch } from "react-redux";
import { getNameGame, getGames } from "../../actions";
import "./SerchBar.css";

export default function SearchBar() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  const re = /^[0-9a-zA-ZÁ-ÿ.:-\s]{0,40}$/;

  useEffect(() => {
    if (name.trim() === "") {
      dispatch(getGames());
    }
  }, [dispatch, name]);

  function handlerInputChange(e) {
    const inputValue = e.target.value;
    setName(inputValue);
    if (!re.exec(inputValue)) {
      inputValue.length > 40
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
    if (name.trim()) {
      dispatch(getNameGame(name));
      setError("");
    }
    setInputDisabled(false);
  }

  return (
    <div className="search">
      <input
        className="input"
        type="text"
        placeholder="Search by name"
        value={name}
        onChange={(e) => handlerInputChange(e)}
      />
      {error && <p className="error">{error}</p>}
      <button
        disabled={inputDisabled}
        className="button"
        type="submit"
        onClick={(e) => handleSubmit(e)}
      >
        Search
      </button>
    </div>
  );
}