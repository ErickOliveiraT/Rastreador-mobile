import React from "react";
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

export default function Menu({ history, getCoordinatesByLogin }) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  React.useEffect(() => {
    console.log(currentMonth);
  });

  function logout() {
    localStorage.setItem("loginValid", "false");
    history.push("/");
  }

  const toggleDrawer = (side, open) => event => {
    setState({ ...state, [side]: open });
  };
  function range(startAt = 0, size) {
    return [...Array(size).keys()].map(i => i + startAt);
  }
  const months = [
    { name: "Janeiro", tag: "JAN", days: range(1, 31) },
    { name: "Fevereiro", tag: "FEB", days: range(1, 28) },
    { name: "Março", tag: "MAR", days: range(1, 31) },
    { name: "Abril", tag: "APR", days: range(1, 30) },
    { name: "Maio", tag: "MAY", days: range(1, 31) },
    { name: "Junho", tag: "JUN", days: range(1, 30) },
    { name: "Julho", tag: "JUL", days: range(1, 31) },
    { name: "Agosto", tag: "AUG", days: range(1, 31) },
    { name: "Setembro", tag: "SEP", days: range(1, 30) },
    { name: "Outubro", tag: "OCT", days: range(1, 31) },
    { name: "Novembro", tag: "NOV", days: range(1, 30) },
    { name: "Dezembro", tag: "DEC", days: range(1, 31) }
  ];
  const [currentMonth, setCurrentMonth] = React.useState(months[0]);

  const handleChange = e => {
    setCurrentMonth(months.find(month => month.tag === e.target.value));
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
          value={currentMonth.tag}
          onChange={handleChange}
          inputProps={{
            name: "currentMonth",
            id: "month-helper"
          }}
        >
          {/* Month options */}
          {months.map(month => (
            <MenuItem key={month.tag} value={month.tag}>
              {month.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Days buttons */}
      {currentMonth.days.map(day => (
        <Button
          key={day}
          onClick={() => getCoordinatesByLogin(day, currentMonth.tag, 2019)}
        >
          {day}
        </Button>
      ))}

      {/* LOGOUT BUTTON */}
      <div style={{ position: "relative", top: "50%" }}>
        <Button
          color="secondary"
          style={{ textAlign: "left", display: "block", width: "100%" }}
          onClick={logout}
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
