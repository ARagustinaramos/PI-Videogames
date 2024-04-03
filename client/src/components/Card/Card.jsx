import React from "react";
import star from "../img/star.png";
//import s from "./Card.module.css";

export default function Card({ name, image, rating, genres }) {
  return (
    <div className={s.card}>
      <img src={image} alt="not found" width="250px" height="125px" />
      <h3>{name}</h3>
      <p>
        <div>
          {rating}
          <img src={star} alt="star" />
        </div>
      </p>
      <p>{genres.join(", ")}</p>
    </div>
  );
}
