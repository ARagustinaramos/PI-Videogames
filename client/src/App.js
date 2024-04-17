
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LandingPage from "./components/Landingpage/Landingpage"
import Homepage from "./components/Homepage/Homepage"
import GameCreate from "./components/GameCreate/GameCreate";
import Details from "./components/Details/Details";
import Update from "./components/Update/Update";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/videogames/update" component={Update} />
          <Route path="/videogames/add" component={GameCreate} />
          <Route path="/videogames/:id" component={Details} />
          <Route path="/videogames" component={Homepage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;