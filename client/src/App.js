import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import DashBoard from "./components/DashBoard";
import Login from "./components/Login";
import Register from "./components/Register";
import Menu from "./components/DashBoard/Menu";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/dashboard" component={DashBoard} />
        <Route exact path="/menu" component={Menu} />
      </BrowserRouter>
    );
  }
}

export default App;
