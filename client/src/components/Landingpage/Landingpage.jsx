import React from "react";
import { Link } from "react-router-dom";
import "./Landingpage.css";

export default function LandingPage() {
  return (
    <div className="landing-body">
      <div>
        <h1>WELCOME TO HENRY GAMES</h1>
        <Link to="/videogames">
          <button>Enter</button>
        </Link>
      </div>
    </div>
  );
}

