// Action Types
export const Types = {
  GET_COORDINATES: "coordinates/GET_COORDINATES"
};

// Reducer
const initialState = {
  login: "",
  day: 1,
  monthTag: "JAN",
  year: 2019
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
export function getCoordinates(login, day, monthTag, year) {
  return {
    type: Types.GET_COORDINATES,
    payload: {
      request: {
        url: `/coordenadas/${day}/${monthTag}/${year}/${login}`,
        method: "GET",
        data: {
          login,
          day,
          month: monthTag,
          year
        }
      }
    }
  };
}
