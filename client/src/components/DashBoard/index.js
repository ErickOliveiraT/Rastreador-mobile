import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMapGL, { Marker } from "react-map-gl";
import Menu from "./Menu";
import { getCoordinates } from "../../store/ducks/coordinates";

export default function DashBoard(props) {
  const user = useSelector(state => state.user);
  const coordinates = useSelector(state => state.coordinates);
  const [marker, setMarker] = useState({
    latitude: -22.415865,
    longitude: -45.4676787
  });
  const [viewport, setViewPort] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: -22.415865,
    longitude: -45.4676787,
    zoom: 16
  });
  const dispatch = useDispatch();

  const getCoordinatesByLogin = async (day, monthTag, year) => {
    await dispatch(getCoordinates(user.login, day, monthTag, year)).then(
      res => {
        console.log(res.payload);
      }
    );
  };
  // componentDidMount() {
  //   let intervalRef = setInterval(() => {
  //     let latitude = this.state.marker.latitude + 0.00001;
  //     let longitude = this.state.marker.longitude + 0.00001;
  //     let marker = { latitude, longitude };
  //     console.log(this.state.marker.latitude);
  //     this.setState({
  //       marker
  //     });
  //   }, 1000);
  //   this.setState({
  //     ...this.state,
  //     intervalRef
  //   });
  // }

  // componentWillUnmount() {
  //   clearInterval(this.state.intervalRef);
  // }

  return (
    <div>
      <ReactMapGL
        mapboxApiAccessToken={
          "pk.eyJ1IjoiYnJpdW9yIiwiYSI6ImNrMGxkeTR6ZDBpem4zbHVwMzBscG90cGIifQ.C-0c4zSBGhajBrFatd6eig"
        }
        {...viewport}
        onViewportChange={viewport => setViewPort(viewport)}
      >
        <Marker
          latitude={marker.latitude}
          longitude={marker.longitude}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <img
            src="https://material-ui.com/static/images/avatar/1.jpg"
            alt=""
            width="50"
            height="50"
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
