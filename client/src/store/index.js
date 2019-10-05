import { createStore, applyMiddleware } from "redux";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import reducers from "./ducks";

const client = axios.create({
  //all axios can be used, shown in axios documentation
  baseURL: "http://localhost:4000",
  responseType: "json"
});

const store = createStore(
  reducers, //custom reducers
  applyMiddleware(axiosMiddleware(client))
);
export default store;
