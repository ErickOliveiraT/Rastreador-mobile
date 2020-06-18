import { combineReducers } from "redux";
import { userReducer as user } from "./user";
import { coordinatesReducer as coordinates } from "./coordinates";

const reducers = combineReducers({
  user,
  coordinates
});

export default reducers;
