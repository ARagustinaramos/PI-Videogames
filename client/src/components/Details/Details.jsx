import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getDetails, deleteGame, resetDetail, setFirstMount } from "../actions";

import NavBar from "./NavBar";

//import s from "./Details.module.css";

export default function Details(props) {


  const dispatch = useDispatch();
  const history = useHistory();

  const myGame = useSelector((state) => state.detail);
  const created = myGame.createdInDb ? true : false;

  useEffect(() => {
    dispatch(getDetails(props.match.params.id));
    return dispatch(resetDetail());
  }, [dispatch, props.match.params.id]);

  function handleDelete(e) {
    e.preventDefault();
    dispatch(setFirstMount(true));
    dispatch(deleteGame(myGame.id));
    alert("Game deleted");
    history.push("/videogames");
  }

  return (
    <div>
      <NavBar />

      {Object.keys(myGame).length > 0 ? (
        <div className={s.main}>
          <div className={created ? s.page2 : s.page1}>
            <img src={myGame.image} alt="not found" className={s.image} />

            <div className={s.info}>
              <h2 className={s.name}>{myGame.name}</h2>
              <p>released: {myGame.released}</p>
              <p>Rating {myGame.rating}</p>
            </div>

            <div className={s.description}>
              <p>{myGame.description}</p>
            </div>

            <fieldset className={s.platforms}>
              <legend>platforms</legend>
              <ul>
                {myGame.platforms.map((g, i) => (
                  <li key={i}>-{g}</li>
                ))}
              </ul>
            </fieldset>

            <fieldset className={s.genres}>
              <legend>Genres</legend>
              <ul>
                {myGame.genres.map((g, i) => (
                  <li key={i}>-{g}</li>
                ))}
              </ul>
            </fieldset>

            <div className={created ? s.buttons : s.hidden}>
              <button onClick={(e) => handleDelete(e)}>Delete</button>
              <Link to={"/videogames/update"}>
                <button>Update</button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
