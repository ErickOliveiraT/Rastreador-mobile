import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMapGL, { Marker } from "react-map-gl";
import Menu from "./Menu";
import PolylineOverlay from "./PolylineOverlay";
import Avatar from "@material-ui/core/Avatar";
import { logout } from "../../store/ducks/user";
import {
  getLastCoordinate,
  getCoordinates
} from "../../store/ducks/coordinates";

import Snackbar from "@material-ui/core/Snackbar";

export default function DashBoard(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const coordinates = useSelector(state => state.coordinates);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewport, setViewPort] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 0,
    longitude: 0,
    zoom: 16
  });
  let intervalRef = useRef([]);

  const [showAlert, setShowAlertMessage] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const handleAlertOpen = () => {
    setShowAlertMessage(true);
  };

  const handleAlertClose = () => {
    setShowAlertMessage(false);
  };

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
    dispatch(getLastCoordinate(user.login, setViewPort));
    let id = setInterval(() => {
      dispatch(getLastCoordinate(user.login));
    }, 2000);
    intervalRef.current.push(id);
  };

  const handleMouseMove = e => {
    setMousePosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <ReactMapGL
        mapboxApiAccessToken={
          "pk.eyJ1IjoiYnJpdW9yIiwiYSI6ImNrMGxkeTR6ZDBpem4zbHVwMzBscG90cGIifQ.C-0c4zSBGhajBrFatd6eig"
        }
        {...viewport}
        onViewportChange={viewport => setViewPort(viewport)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <PolylineOverlay
          mousePosition={mousePosition}
          points={coordinates.points}
          handleAlertOpen={handleAlertOpen}
          setAlertMessage={setAlertMessage}
        />
        <Marker
          latitude={coordinates.lastCoordinate[1]}
          longitude={coordinates.lastCoordinate[0]}
          offsetLeft={-15}
          offsetTop={-10}
        >
          <Avatar style={{ backgroundColor: "blue" }}>
            {user.name.charAt(0)}
          </Avatar>
        </Marker>
      </ReactMapGL>
      <Menu
        getCoordinates={getCoordinates}
        handleLogout={handleLogout}
        handleCancel={handleCancel}
        handleInit={handleInit}
        handleAlertOpen={handleAlertOpen}
        setAlertMessage={setAlertMessage}
        setViewPort={setViewPort}
      />
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
