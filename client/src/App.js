import "./App.css";
//import "./normalize.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import GameCreate from "./components/GameCreate";
import Details from "./components/Details";
import Update from "./components/Update";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/videogames/update" component={Update} />
          <Route path="/videogames/add" component={GameCreate} />
          <Route path="/videogames/:id" component={Details} />
          <Route path="/videogames" component={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;