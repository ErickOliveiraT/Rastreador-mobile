import React from "react";
import Grid from "@material-ui/core/Grid";
import Logo from "../../img/logo.png";
import { useStyles } from "./style";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Login() {
  const classes = useStyles();
  const [loginForm, setLoginForm] = React.useState(true);

  function changeForm() {
    setLoginForm(!loginForm);
  }

  return (
    <div className={classes.wrapper}>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.mainContainer}
      >
        <Grid item md={12}>
          <Grid container direction="row">
            <Grid item md={3}>
              <img width="100" height="80" alt="" src={Logo} />
            </Grid>
            <Grid item md={9}>
              <h1 className={classes.formTitle}>Rastreador Mobile</h1>
            </Grid>
          </Grid>
        </Grid>
        {/* Login/Register Form */}
        {loginForm ? (
          <LoginForm changeForm={changeForm} />
        ) : (
          <RegisterForm changeForm={changeForm} />
        )}
      </Grid>
    </div>
  );
}
