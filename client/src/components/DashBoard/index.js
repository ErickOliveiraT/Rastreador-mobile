import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMapGL, { Marker } from "react-map-gl";
import Menu from "./Menu";
import PolylineOverlay from "./PolylineOverlay";
import { logout } from "../../store/ducks/user";
import {
  getLastCoordinate,
  getCoordinates
} from "../../store/ducks/coordinates";

export default function DashBoard(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const coordinates = useSelector(state => state.coordinates);
  const [viewport, setViewPort] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 0,
    longitude: 0,
    zoom: 16
  });
  let intervalRef = useRef([]);

  useEffect(() => {
    dispatch(getLastCoordinate(user.login, setViewPort));
    // interval to get the last coordinate by each 2 seconds
    let id = setInterval(() => {
      dispatch(getLastCoordinate(user.login));
    }, 2000);
    intervalRef.current.push(id);
    // this return is the same as componentWillUnmount
    // when unmount component clear the interval that get last coordinate
    return () => {
      for (let i = 0; i < intervalRef.current.length; i++)
        clearInterval(intervalRef.current[i]);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout(props.history));
  };

  const handleCancel = () => {
    for (let i = 0; i < intervalRef.current.length; i++)
      clearInterval(intervalRef.current[i]);
  };
  const handleInit = () => {
    dispatch(getLastCoordinate(user.login));
    let id = setInterval(() => {
      dispatch(getLastCoordinate(user.login));
    }, 2000);
    intervalRef.current.push(id);
  };

  return (
    <div>
      <ReactMapGL
        mapboxApiAccessToken={
          "pk.eyJ1IjoiYnJpdW9yIiwiYSI6ImNrMGxkeTR6ZDBpem4zbHVwMzBscG90cGIifQ.C-0c4zSBGhajBrFatd6eig"
        }
        {...viewport}
        onViewportChange={viewport => setViewPort(viewport)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <PolylineOverlay points={coordinates.points} />
        <Marker
          latitude={coordinates.lastCoordinate[1]}
          longitude={coordinates.lastCoordinate[0]}
          offsetLeft={-15}
          offsetTop={-10}
        >
          <img
            src="https://material-ui.com/static/images/avatar/1.jpg"
            alt=""
            width="30"
            height="30"
            style={{ borderRadius: 100 }}
          />
        </Marker>
      </ReactMapGL>
      <Menu
        getCoordinates={getCoordinates}
        handleLogout={handleLogout}
        handleCancel={handleCancel}
        handleInit={handleInit}
      />
    </div>
  );
}
