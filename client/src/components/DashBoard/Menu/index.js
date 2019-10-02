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

export default function Menu() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const toggleDrawer = (side, open) => event => {
    setState({ ...state, [side]: open });
  };

  const [values, setValues] = React.useState({
    month: ""
  });
  const handleChange = event => {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, true)}
      onKeyDown={toggleDrawer(side, true)}
    >
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="month-helper">Escolha o mês</InputLabel>
        <Select
          value={values.month}
          onChange={handleChange}
          inputProps={{
            name: "month",
            id: "month-helper"
          }}
        >
          <MenuItem value={1}>Janeiro</MenuItem>
          <MenuItem value={2}>Fevereiro</MenuItem>
          <MenuItem value={3}>Março</MenuItem>
          <MenuItem value={4}>Abril</MenuItem>
          <MenuItem value={5}>Maio</MenuItem>
          <MenuItem value={6}>Junho</MenuItem>
          <MenuItem value={7}>Julho</MenuItem>
          <MenuItem value={8}>Agosto</MenuItem>
          <MenuItem value={9}>Setembro</MenuItem>
          <MenuItem value={10}>Outubro</MenuItem>
          <MenuItem value={11}>Novembro</MenuItem>
          <MenuItem value={12}>Dezembro</MenuItem>
        </Select>
      </FormControl>

      <Button>1</Button>
      <Button>2</Button>
      <Button>3</Button>
      <Button>4</Button>
      <Button>5</Button>
      <Button>6</Button>
      <Button>7</Button>
      <Button>8</Button>
      <Button>9</Button>
      <Button>10</Button>
      <Button>11</Button>
      <Button>12</Button>
      <Button>13</Button>
      <Button>14</Button>
      <Button>15</Button>
      <Button>16</Button>
      <Button>17</Button>
      <Button>18</Button>
      <Button>19</Button>
      <Button>20</Button>
      <Button>21</Button>
      <Button>22</Button>
      <Button>23</Button>
      <Button>24</Button>
      <Button>25</Button>
      <Button>26</Button>
      <Button>27</Button>
      <Button>28</Button>
      <Button>29</Button>
      <Button>30</Button>
      <Button>31</Button>
    </div>
  );

  return (
    <div>
      <Button onClick={toggleDrawer("left", true)}>Open Left</Button>
      <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
        {sideList("left")}
      </Drawer>
    </div>
  );
}
