import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Logo from "../../img/logo.png";
import { useStyles } from "./style";
import { Link } from "react-router-dom";

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

export default function Register() {
  const classes = useStyles();
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
              <h1
                style={{
                  margin: 0,
                  paddingLeft: 10,
                  fontFamily: "Ubuntu"
                }}
              >
                Rastreador Mobile
              </h1>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12}>
          <TextField
            id="standard-name"
            label="Email"
            className={classes.textField}
            onChange={() => {}}
            margin="normal"
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            id="standard-name"
            label="Password"
            className={classes.textField}
            onChange={() => {}}
            margin="normal"
          />
        </Grid>
        <Grid item md={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            component={AdapterLink}
            to="/dashboard"
            style={{ backgroundColor: "#59a8b5" }}
          >
            Login
          </Button>
        </Grid>
        <Grid item md={12}>
          <Button
            variant="contained"
            color="default"
            component={AdapterLink}
            to="/register"
            className={classes.button}
          >
            Register
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
