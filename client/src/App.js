import React from "react";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import DashBoard from "./components/DashBoard";
import Login from "./components/Login";
import Menu from "./components/DashBoard/Menu";
import { Provider } from "react-redux";
import store from "./store";

function PrivateRoute({ component: Component, ...rest }) {
  React.useEffect(() => {
    console.log("PRIVATE ROUTE: " + localStorage.getItem("loginValid"));
  });
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("loginValid") === "true" ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <PrivateRoute exact path="/dashboard" component={DashBoard} />
          <Route exact path="/menu" component={Menu} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
