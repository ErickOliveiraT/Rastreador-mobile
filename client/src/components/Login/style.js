import { makeStyles } from "@material-ui/core/styles";
import Background from "../../img/bg.jpg";

export const useStyles = makeStyles(theme => ({
  wrapper: {
    height: "100vh",
    background: `url(${Background}) no-repeat`,
    backgroundSize: "contain",
    backgroundPosition: "left"
  },
  mainContainer: {
    paddingLeft: "36%",
    paddingTop: 80
  },
  button: {
    margin: theme.spacing(1),
    marginTop: 18,
    width: 400
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400
  },
  input: {
    display: "none"
  }
}));
