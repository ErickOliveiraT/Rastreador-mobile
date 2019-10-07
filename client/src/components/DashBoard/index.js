import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMapGL, { Marker } from "react-map-gl";
import Menu from "./Menu";
import { getCoordinates } from "../../store/ducks/coordinates";
import PolylineOverlay from "./PolylineOverlay";

export default function DashBoard(props) {
  const user = useSelector(state => state.user);
  const [coordinates, setCoordinates] = useState({
    lastCoordinate: [0, 0],
    points: []
  });
  const [viewport, setViewPort] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: -22.415865,
    longitude: -45.4676787,
    zoom: 16
  });
  const dispatch = useDispatch();

  useEffect(() => {
    //const d = new Date();
    //getCoordinatesByLogin(d.getDate(), d.getMonth() + 1, d.getFullYear(), true);
    const intervalRef = setInterval(() => {
      // getLastCoordinate()
    }, 1000);
    return () => clearInterval(intervalRef);
  }, []);

  const getCoordinatesByLogin = (
    day,
    month,
    year,
    justLastCoordinate = false
  ) => {
    // each call of this function erase the coordinates
    setCoordinates(prevState => ({ ...prevState, points: [] }));
    dispatch(getCoordinates(user.login, day, month, year)).then(res => {
      let newCoordinate = [];
      const resCoordinates = res.payload.data;
      if (resCoordinates.length > 0) {
        for (let i = 0; i < resCoordinates.length; i++) {
          newCoordinate.push([
            Number.parseFloat(resCoordinates[i].longitude),
            Number.parseFloat(resCoordinates[i].latitude)
          ]);
        }
        setCoordinates(prevState => ({ ...prevState, points: newCoordinate }));
      } else {
        //TODO: mensagem de sem coordenadas nesse dia
      }
    });
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
          offsetLeft={-20}
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
        history={props.history}
        getCoordinatesByLogin={getCoordinatesByLogin}
      />
    </div>
  );
}
