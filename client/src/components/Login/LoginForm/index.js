import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "../style";
import { Link } from "react-router-dom";

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

export default function LoginForm({ changeForm }) {
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
          label="Senha"
          className={classes.textField}
          onChange={() => {}}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} style={{ marginTop: 18 }}>
        <Button
          variant="contained"
          color="primary"
          component={AdapterLink}
          to="/dashboard"
          className={classes.button}
          style={{ backgroundColor: "#59a8b5" }}
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
