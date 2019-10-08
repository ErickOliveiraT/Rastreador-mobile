import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
// import { register } from "../../../store/ducks/user";
import { useStyles } from "../style";

export default function RegisterForm({
  handleChangeForm,
  handleChangeUser,
  submitRegister
}) {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Grid item xs={12}>
        <TextField
          id="login"
          label="Usuário"
          className={classes.textField}
          onChange={handleChangeUser}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="name"
          label="Nome completo"
          className={classes.textField}
          onChange={handleChangeUser}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="password"
          label="Senha"
          type="password"
          className={classes.textField}
          onChange={handleChangeUser}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="confirmPassword"
          label="Confirme sua senha"
          type="password"
          className={classes.textField}
          onChange={handleChangeUser}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} style={{ marginTop: 18 }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={submitRegister}
          style={{ backgroundColor: "#59a8b5" }}
        >
          Registrar-se
        </Button>
      </Grid>
      <Grid item xs={12} style={{ marginTop: 18 }}>
        <Button className={classes.button} onClick={handleChangeForm}>
          voltar ao login
        </Button>
      </Grid>
    </Grid>
  );
}
