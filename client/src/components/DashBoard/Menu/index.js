import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import RoomIcon from "@material-ui/icons/Room";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";

const useStyles = makeStyles(theme => ({
  list: {
    width: 265
  },

  formControl: {
    margin: theme.spacing(2),
    width: "88%"
  }
}));

export default function Menu({
  handleLogout,
  getCoordinates,
  handleCancel,
  handleInit,
  handleAlertOpen,
  setAlertMessage,
  setViewPort
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const toggleDrawer = (side, open) => event => {
    setState({ ...state, [side]: open });
  };
  function range(startAt = 0, size) {
    return [...Array(size).keys()].map(i => i + startAt);
  }
  const months = [
    { name: "Janeiro", month: 1, days: range(1, 31) },
    { name: "Fevereiro", month: 2, days: range(1, 28) },
    { name: "Março", month: 3, days: range(1, 31) },
    { name: "Abril", month: 4, days: range(1, 30) },
    { name: "Maio", month: 5, days: range(1, 31) },
    { name: "Junho", month: 6, days: range(1, 30) },
    { name: "Julho", month: 7, days: range(1, 31) },
    { name: "Agosto", month: 8, days: range(1, 31) },
    { name: "Setembro", month: 9, days: range(1, 30) },
    { name: "Outubro", month: 10, days: range(1, 31) },
    { name: "Novembro", month: 11, days: range(1, 30) },
    { name: "Dezembro", month: 12, days: range(1, 31) }
  ];
  const [currentMonth, setCurrentMonth] = React.useState(months[10]);

  const handleChange = e => {
    setCurrentMonth(months.find(month => month.month === e.target.value));
  };

  const sideContent = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, true)}
      onKeyDown={toggleDrawer(side, true)}
    >
      <Grid container>
        <Grid item xs={3}>
          <Avatar style={{ margin: 10, backgroundColor: "blue" }}>
            {user.name.charAt(0)}
          </Avatar>
        </Grid>
        <Grid item xs={7}>
          <h2 style={{ fontSize: 20, fontWeight: "normal" }}>{user.name}</h2>
        </Grid>
        <Grid item xs={2}>
          {/* <ButtonBase
            onClick={toggleDrawer(side, true)}
            style={{ marginLeft: 10, marginTop: 10 }}
          >
            <ArrowBackIosIcon />
          </ButtonBase> */}
        </Grid>
      </Grid>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="month-helper">Escolha o mês</InputLabel>
        <Select
          value={currentMonth.month}
          onChange={handleChange}
          inputProps={{
            name: "currentMonth",
            id: "month-helper"
          }}
        >
          {/* Month options */}
          {months.map(month => (
            <MenuItem key={month.month} value={month.month}>
              {month.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Days buttons */}
      {currentMonth.days.map(day => (
        <Button
          key={day}
          onClick={() => {
            handleCancel();
            dispatch(
              getCoordinates(
                day,
                currentMonth.month,
                (new Date()).getFullYear(),
                user.login,
                handleAlertOpen,
                setAlertMessage,
                setViewPort
              )
            );
          }}
        >
          {day}
        </Button>
      ))}
      <div style={{ position: "relative", top: "15%" }}>
        <Button
          color="primary"
          style={{ textAlign: "left", display: "block", width: "100%" }}
          onClick={() => {
            handleInit();
          }}
        >
          <RoomIcon style={{ verticalAlign: "middle", paddingRight: 5 }} />
          Última posição
        </Button>
      </div>{" "}
      {/* LOGOUT BUTTON */}
      <div style={{ position: "relative", top: "18%" }}>
        <Button
          color="secondary"
          style={{ textAlign: "left", display: "block", width: "100%" }}
          onClick={handleLogout}
        >
          <ExitToAppIcon style={{ verticalAlign: "middle", paddingRight: 5 }} />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        style={{ position: "absolute", top: 5, left: 5 }}
        onClick={toggleDrawer("left", true)}
      >
        MENU
      </Button>
      <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
        {sideContent("left")}
      </Drawer>
    </div>
  );
}
