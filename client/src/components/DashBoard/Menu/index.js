import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

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
  handleInit
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
  const [currentMonth, setCurrentMonth] = React.useState(months[9]);

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
            dispatch(getCoordinates(day, currentMonth.month, 2019, user.login));
          }}
        >
          {day}
        </Button>
      ))}
      <div style={{ position: "relative", top: "30%" }}>
        <Button
          color="secondary"
          style={{ textAlign: "left", display: "block", width: "100%" }}
          onClick={() => {
            handleInit();
          }}
        >
          Última posição
        </Button>
      </div>{" "}
      {/* LOGOUT BUTTON */}
      <div style={{ position: "relative", top: "50%" }}>
        <Button
          color="secondary"
          style={{ textAlign: "left", display: "block", width: "100%" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Button
        variant="outlined"
        color="default"
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
