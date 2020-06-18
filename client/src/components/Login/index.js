import React from "react";
import Grid from "@material-ui/core/Grid";
import Logo from "../../img/logo.png";
import Snackbar from "@material-ui/core/Snackbar";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { login, register, updateUser } from "../../store/ducks/user";
import { useDispatch, useSelector } from "react-redux";
import { useStyles } from "./style";

export default function Login(props) {
  const classes = useStyles();

  const [loginForm, setLoginForm] = React.useState(true);
  const [showAlert, setShowAlertMessage] = React.useState(false);

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const submitLogin = () => {
    dispatch(login(user, props.history, setShowAlertMessage));
  };

  const submitRegister = () => {
    dispatch(register(user, setShowAlertMessage, handleChangeForm));
  };

  const handleChangeUser = e => {
    const newUser = user;
    newUser[e.target.id] = e.target.value;
    dispatch(updateUser(newUser));
  };

  const handleChangeForm = () => {
    setLoginForm(!loginForm);
  };

  const handleAlertOpen = () => {
    setShowAlertMessage(true);
  };

  const handleAlertClose = () => {
    setShowAlertMessage(false);
  };

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
          <LoginForm
            handleChangeForm={handleChangeForm}
            submitLogin={submitLogin}
            handleChangeUser={handleChangeUser}
          />
        ) : (
          <RegisterForm
            handleChangeForm={handleChangeForm}
            handleAlertOpen={handleAlertOpen}
            submitRegister={submitRegister}
            handleChangeUser={handleChangeUser}
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
        message={<span id="message-id">{user.alertMessage}</span>}
      />
    </div>
  );
}
