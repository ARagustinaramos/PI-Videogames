import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getDetails, deleteGame, resetDetail, setFirstMount } from "../../actions";
import NavBar from "../NavBar/NavBar";
import "./Details.css";

export default function Details(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const myGame = useSelector((state) => state.detail);
  const created = myGame.createdInDb ? true : false;

  useEffect(() => {
    setLoading(true);
    if (props.match.params.id) {
      dispatch(getDetails(props.match.params.id))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
    return () => dispatch(resetDetail());
  }, [dispatch, props.match.params.id]);

  function handleDelete(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this game?")) {
      dispatch(setFirstMount(true));
      dispatch(deleteGame(myGame.id));
      alert("Game deleted");
      history.push("/videogames");
    }
  }

  useEffect(() => {
    console.log("myGame:", myGame); // Verificar la estructura de los datos del juego
  }, [myGame]);

  return (
    <div>
      <NavBar />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="detail">
          <div className={created ? "page2" : "page1"}>
            {myGame && (
              <>
                <img src={myGame.image} alt="not found" className="image" />
                <div className="info">
                  <h2>{myGame.name}</h2>
                  <p>Released: {myGame.released}</p>
                  <p>Rating: {myGame.rating}</p>
                </div>
                <div className="description">
                  <p>{myGame.description}</p>
                </div>
                {created && (
                  <div className="buttons">
                    <button onClick={handleDelete}>Delete</button>
                  </div>
                )}
                {myGame && myGame.platforms && myGame.platforms.length > 0 && (
                  <fieldset className="platforms">
                    <legend>Platforms</legend>
                    <ul>
                      {myGame.platforms.map((platform, i) => (
                        <li key={i}>-{typeof platform === 'string' ? platform : platform.name}</li>
                      ))}
                    </ul>
                  </fieldset>
                )}
                {myGame.genres && myGame.genres.length > 0 && (
                  <fieldset className="genres">
                    <legend>Genres</legend>
                    <ul>
                      {myGame.genres.map((genre, i) => (
                        <li key={i}>-{typeof genre === 'string' ? genre : genre.name}</li>
                      ))}
                    </ul>
                  </fieldset>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
