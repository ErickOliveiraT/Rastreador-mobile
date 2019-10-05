import React from "react";
import Grid from "@material-ui/core/Grid";
import Logo from "../../img/logo.png";
import Snackbar from "@material-ui/core/Snackbar";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useStyles } from "./style";

export default function Login(props) {
  const classes = useStyles();
  const [loginForm, setLoginForm] = React.useState(true);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);

  const handleAlertOpen = () => {
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

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
          <LoginForm changeForm={changeForm} history={props.history} />
        ) : (
          <RegisterForm
            changeForm={changeForm}
            handleAlertOpen={handleAlertOpen}
            setAlertMessage={setAlertMessage}
          />
        )}
      </Grid>
      {/* Alert Message on top */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        key={`top,center`}
        open={showAlert}
        onClose={handleAlertClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{alertMessage}</span>}
      />
    </div>
  );
}
