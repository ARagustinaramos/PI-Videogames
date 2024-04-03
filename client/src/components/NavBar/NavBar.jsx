import React from "react";
import { Link } from "react-router-dom";

//import logo from "../img/logo.jpg";
//import s from "./NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={s.navbar}>
      <Link to="/videogames">
        <img src={logo} alt="icon" />
      </Link>
      <Link to="/videogames/add">
        <button>+ Add Game</button>
      </Link>
    </nav>
  );
}
