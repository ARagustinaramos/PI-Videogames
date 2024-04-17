import React from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.jpg";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className= "navbar">
      <Link to="/videogames">
        <img src={logo} alt="icon" />
      </Link>
      <Link to="/videogames/add">
        <button>+ Add Game</button>
      </Link>
    </nav>
  );
}
