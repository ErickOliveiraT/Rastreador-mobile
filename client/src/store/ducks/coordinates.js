// Action Types
export const Types = {
  GET_COORDINATES: "coordinates/GET_COORDINATES"
};

// Reducer
const initialState = {
  login: "bruno",
  day: 5,
  month: 10,
  year: 2019,
  points: []
};

export function coordinatesReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_COORDINATES:
      return {
        ...state
      };
    default:
      return state;
  }
}

// Action Creators
export function getCoordinates(login, day, month, year) {
  return {
    type: Types.GET_COORDINATES,
    payload: {
      request: {
        url: `/coordenadas/${day}/${month}/${year}/${login}`,
        method: "GET",
        data: {
          login,
          day,
          month,
          year
        }
      }
    }
  };
}
