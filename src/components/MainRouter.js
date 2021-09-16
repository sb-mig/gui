import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Main from './Main'
import Navigation from "./Navigation";
import Status from "./Status";
import React, {useContext} from "react";
import {GlobalStatusContext} from "../contexts/GlobalStatusContext";
import {Header} from "./styled/Header";
import {StatusBar} from "./styled/StatusBar";

const MainRouter = () => {
  const {loading, running} = useContext(GlobalStatusContext)

  return (
      <Router>
        <Header>
          <Navigation />
          <StatusBar>
            <div>
              <Status loading={loading} />
              <div>Loading</div>
            </div>
            <div>
              <Status loading={running} />
              <div>Running</div>
            </div>
          </StatusBar>
        </Header>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/about">
              <About/>
            </Route>
            <Route path="/users">
              <Users/>
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
      </Router>
  )
}


function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default MainRouter;