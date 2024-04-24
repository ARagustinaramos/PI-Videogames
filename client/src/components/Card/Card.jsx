import React from "react";
import estrella from "../../img/estrella.jpg";
import "./Card.css";

export default function Card({ name, image, rating, genres }) {
 
  
  const genresText = Array.isArray(genres) && genres.length > 0
    ? genres.map(genre => typeof genre === 'object' ? genre.name : genre).join(", ")
    : "No genres";

  return (
    <div className="card">
      <img src={image} alt={name} width="250px" height="125px" />
      <h3>{name}</h3>
      <p>
        Rating: {rating}
        <img src={estrella} alt="star" />
      </p>
      <p>{genresText}</p>
    </div>
  );
}
