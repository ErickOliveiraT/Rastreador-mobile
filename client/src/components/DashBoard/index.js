import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

class DashBoard extends Component {
  state = {
    marker: {
      latitude: -22.415865,
      longitude: -45.4676787
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: -22.415865,
      longitude: -45.4676787,
      zoom: 16
    }
  };

  componentDidMount() {
    setInterval(() => {
      let latitude = this.state.marker.latitude + 0.00001;
      let longitude = this.state.marker.longitude + 0.00001;
      let marker = { latitude, longitude };
      console.log(this.state.marker.latitude);
      this.setState({
        marker
      });
    }, 1000);
  }

  render() {
    return (
      <ReactMapGL
        mapboxApiAccessToken={
          "pk.eyJ1IjoiYnJpdW9yIiwiYSI6ImNrMGxkeTR6ZDBpem4zbHVwMzBscG90cGIifQ.C-0c4zSBGhajBrFatd6eig"
        }
        {...this.state.viewport}
        onViewportChange={viewport => this.setState({ viewport })}
      >
        <Marker
          latitude={this.state.marker.latitude}
          longitude={this.state.marker.longitude}
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
    );
  }
}

export default DashBoard;
