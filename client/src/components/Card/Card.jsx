import React from "react";
import estrella from "../../img/estrella.jpg";
import "./Card.css";

export default function Card({ name, image, rating, genres }) {
  return (
    <div className="card">
      <img src={image} alt={name} width="250px" height="125px" />
      <h3>{name}</h3>
      <p>
        Rating: {rating}
        <img src={estrella} alt="star" />
      </p>
      <p>{genres && genres.length > 0 ? genres.join(", ") : "No genres"}</p>
    </div>
  );
}
