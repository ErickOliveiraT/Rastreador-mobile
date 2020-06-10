import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { login } from "../../../store/ducks/auth";
import { useStyles } from "../style";

export default function LoginForm({ changeForm, history }) {
  const classes = useStyles();
  const [user, setUser] = useState({ login: "", password: "" });
  const dispatch = useDispatch();

  const submitLogin = async () => {
    await dispatch(login(user)).then(res => {
      console.log('res.payload: ', res.payload);
      localStorage.setItem("loginValid", res.payload.data.valid.toString());
      history.push("/dashboard");
    });
  };

  const updateUser = e => {
    const newUser = user;
    newUser[e.target.id] = e.target.value;
    setUser(newUser);
  };

  return (
    <Grid item xs={12}>
      <Grid item xs={12}>
        <TextField
          id="login"
          label="Usuário"
          className={classes.textField}
          onChange={updateUser}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="password"
          label="Senha"
          type="password"
          className={classes.textField}
          onChange={updateUser}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} style={{ marginTop: 18 }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          style={{ backgroundColor: "#59a8b5" }}
          onClick={submitLogin}
        >
          Entrar
        </Button>
      </Grid>
      <Grid item xs={12} style={{ marginTop: 18 }}>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          onClick={changeForm}
        >
          Registrar-se
        </Button>
      </Grid>
    </Grid>
  );
}
