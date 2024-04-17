import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
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

  return (
    <div>
      <NavBar />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="detail">
          <div className={created ? "page2" : "page1"}>
            <img src={myGame.image} alt="not found" className="image" />
            <div className="info">
              <h2>{myGame.name}</h2>
              <p>Released: {myGame.released}</p>
              <p>Rating: {myGame.rating}</p>
            </div>
            <div className="description">
              <p>{myGame.description}</p>
            </div>
            {myGame.platforms && Array.isArray(myGame.platforms) && myGame.platforms.length > 0 && (
              <fieldset className="platforms">
                <legend>Platforms</legend>
                <ul>
                  {myGame.platforms.map((platform, index) => (
                    <li key={index}>-{platform}</li>
                  ))}
                </ul>
              </fieldset>
            )}
            {myGame.genres && Array.isArray(myGame.genres) && (
              <fieldset className="genres">
                <legend>Genres</legend>
                <ul>
                  {myGame.genres.map((genre, index) => (
                    <li key={index}>-{genre}</li>
                  ))}
                </ul>
              </fieldset>
            )}
            <div className={created ? "buttons" : "hidden"}>
              <button onClick={(e) => handleDelete(e)}>Delete</button>
              <Link to={"/videogames/update"}>
                <button>Update</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}