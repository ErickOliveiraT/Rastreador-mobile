// Action Types
export const Types = {
  LOGIN: "auth/LOGIN",
  REGISTER: "auth/REGISTER",
  LOGOUT: "auth/LOGOUT"
};

// Reducer
const initialState = {
  name: "",
  login: "bruno",
  password: ""
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case Types.LOGIN:
      return {
        ...state,
        login: action.payload.request.data.login,
        password: action.payload.request.data.password,
        name: action.payload.request.data.name
      };
    case Types.REGISTER:
      return {
        ...state
      };
    case Types.LOGOUT:
      return {
        ...state
      };
    default:
      return state;
  }
}

// Action Creators
export function login(user) {
  return {
    type: Types.LOGIN,
    payload: {
      request: {
        url: "/autenticate",
        method: "POST",
        data: {
          login: user.login,
          password: user.password
        }
      }
    }
  };
}

export function register(user) {
  return {
    type: Types.REGISTER,
    payload: {
      request: {
        url: "/adduser",
        method: "POST",
        data: {
          login: user.login,
          name: user.name,
          password: user.password,
          confirmPassword: user.confirmPassword
        }
      }
    }
  };
}

export function logout() {
  return {
    type: Types.LOGOUT
  };
}
