import axios from "axios";

// Action Types
export const Types = {
  GET_COORDINATES_STARTED: "coordinates/GET_COORDINATES_STARTED",
  GET_COORDINATES_SUCCESS: "coordinates/GET_COORDINATES_SUCCESS",
  GET_COORDINATES_FAILED: "coordinates/GET_COORDINATES_FAILED",
  GET_LAST_COORDINATES_SUCCESS: "coordinates/GET_LAST_COORDINATES_SUCCESS"
};

// Reducer
const initialState = {
  intervalRef: 0,
  lastCoordinate: [0, 0],
  points: [],
  loading: false
};

export function coordinatesReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_COORDINATES_STARTED:
      return {
        ...state,
        lastCoordinate: [0, 0],
        points: [],
        loading: true
      };
    case Types.GET_COORDINATES_SUCCESS:
      return {
        ...state,
        points: action.payload.points,
        lastCoordinate: action.payload.lastCoordinate,
        loading: false
      };
    case Types.GET_LAST_COORDINATES_SUCCESS:
      return {
        ...state,
        lastCoordinate: action.payload.lastCoordinate,
        points: [],
        loading: false
      };
    default:
      return state;
  }
}

// Action Creators
// get all records of coordinates in the date day/month/year,
// and fill the lastcoordinate with the last coordinate of this date
export function getCoordinates(day, month, year, login) {
  return function(dispatch) {
    // in getCoordinatesStarted erase the state
    dispatch(getCoordinatesStarted());
    axios
      .get(`http://localhost:4000/coordenadas/${day}/${month}/${year}/${login}`)
      .then(res => {
        let newPoints = [];
        const resCoordinates = res.data;
        const lastCoordinate = [];
        if (resCoordinates.length > 0) {
          for (let i = 0; i < resCoordinates.length; i++) {
            newPoints.push([
              Number.parseFloat(resCoordinates[i].longitude),
              Number.parseFloat(resCoordinates[i].latitude)
            ]);
          }
          // last position becomes the last position of the date
          lastCoordinate.push(newPoints[newPoints.length - 1]);
          dispatch(getCoordinatesSuccess(newPoints, lastCoordinate[0]));
        }
        // else {
        //   dispatch(getCoordinatesFailed());
        // }
      })
      .catch(error => {
        // dispatch(getCoordinatesFailed());
      });
  };
}

// get the last coordinate of the user and delete the route points
export function getLastCoordinate(login, setViewPort = false) {
  return function(dispatch) {
    axios
      .get(`http://localhost:4000/ultimacoordenada/${login}`)
      .then(res => {
        const lastCoordinate = [
          Number.parseFloat(res.data[0].longitude),
          Number.parseFloat(res.data[0].latitude)
        ];
        dispatch(getLastCoordinatesSuccess(lastCoordinate));
        if (setViewPort) {
          setViewPort(prevState => ({
            ...prevState,
            latitude: lastCoordinate[1],
            longitude: lastCoordinate[0]
          }));
        }
      })
      .catch(error => {
        // dispatch(getLastCoordinatesFailed());
      });
  };
}

const getCoordinatesStarted = () => ({
  type: Types.GET_COORDINATES_STARTED
});

const getCoordinatesSuccess = (points, lastCoordinate) => ({
  type: Types.GET_COORDINATES_SUCCESS,
  payload: {
    points,
    lastCoordinate
  }
});

const getLastCoordinatesSuccess = lastCoordinate => ({
  type: Types.GET_LAST_COORDINATES_SUCCESS,
  payload: {
    lastCoordinate
  }
});
