import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "../style";

export default function RegisterForm({ changeForm }) {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Grid item xs={12}>
        <TextField
          id="standard-name"
          label="Usuário"
          className={classes.textField}
          onChange={() => {}}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="standard-name"
          label="Nome completo"
          className={classes.textField}
          onChange={() => {}}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="standard-name"
          label="Senha"
          className={classes.textField}
          onChange={() => {}}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="standard-name"
          label="Confirme sua senha"
          className={classes.textField}
          onChange={() => {}}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} style={{ marginTop: 18 }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          style={{ backgroundColor: "#59a8b5" }}
        >
          Registrar-se
        </Button>
      </Grid>
      <Grid item xs={12} style={{ marginTop: 18 }}>
        <Button className={classes.button} onClick={changeForm}>
          voltar ao login
        </Button>
      </Grid>
    </Grid>
  );
}
