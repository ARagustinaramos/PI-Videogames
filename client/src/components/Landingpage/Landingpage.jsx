import React from "react";

import { Link } from "react-router-dom";

import s from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={s.main}>
      <div>
        <h1>WELCOME TO HENRY GAMES</h1>
        <Link to="/videogames">
          <button>Enter</button>
        </Link>
      </div>
    </div>
  );
}
