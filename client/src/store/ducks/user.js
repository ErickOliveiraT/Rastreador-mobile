import api from "../../api/api";

// Action Types
export const Types = {
  LOGIN_STARTED: "user/LOGIN_STARTED",
  LOGIN_SUCCESS: "user/LOGIN_SUCCESS",
  LOGIN_FAILED: "user/LOGIN_FAILED",
  REGISTER_STARTED: "user/REGISTER_STARTED",
  REGISTER_SUCCESS: "user/REGISTER_SUCCESS",
  REGISTER_FAILED: "user/REGISTER_FAILED",
  LOGOUT: "user/LOGOUT",
  UPDATE_USER: "user/UPDATE_USER"
};

// Reducer
const initialState = {
  name: localStorage.getItem("name"),
  login: localStorage.getItem("login"),
  password: "",
  confirmPassword: "",
  loading: false,
  alertMessage: ""
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case Types.LOGIN_STARTED:
      return {
        ...state,
        loading: true
      };
    case Types.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        login: action.payload.login,
        name: action.payload.name
      };
    case Types.LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        alertMessage: action.payload.alertMessage
      };
    case Types.REGISTER_STARTED:
      return {
        ...state,
        loading: true
      };
    case Types.REGISTER_SUCCESS:
      return {
        name: "",
        login: "",
        password: "",
        confirmPassword: "",
        loading: false,
        alertMessage: action.payload.alertMessage
      };
    case Types.REGISTER_FAILED:
      return {
        name: "",
        login: "",
        password: "",
        confirmPassword: "",
        loading: false,
        alertMessage: action.payload.alertMessage
      };
    case Types.LOGOUT:
      return {
        name: "",
        login: "",
        password: "",
        confirmPassword: "",
        loading: false,
        alertMessage: ""
      };
    case Types.UPDATE_USER:
      return {
        ...action.user
      };
    default:
      return state;
  }
}

// Action Creators
export function login(user, history, setShowAlertMessage) {
  return function(dispatch) {
    dispatch(loginStarted());
    api
      .post("/auth", {
        login: user.login,
        password: user.password
      })
      .then(res => {
        dispatch(loginSuccess(user.login, res.data.name));
        if (res.data.valid === true) {
          console.log("Login valido");
          localStorage.setItem("loginValid", "true");
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("login", user.login);
          localStorage.setItem("name", res.data.name);
          history.push("/dashboard");
        } else {
          dispatch(loginFailed("Login inválido"));
          setShowAlertMessage(true);
        }
      })
      .catch(error => {
        // TODO: atualizar react-script para usar optional chaining
        if(error.response && error.response.data) {
          dispatch(
            loginFailed(
              error.response.data.error
            )
          );
        }
        else {
          dispatch(
            loginFailed(
              "Ocorreu um erro, tente novamente mais tarde."
            )
          );
        }
        setShowAlertMessage(true);
      });
  };
}

const loginStarted = () => ({
  type: Types.LOGIN_STARTED
});

const loginSuccess = (login, name) => ({
  type: Types.LOGIN_SUCCESS,
  payload: {
    login,
    name
  }
});

const loginFailed = alertMessage => ({
  type: Types.LOGIN_FAILED,
  payload: {
    alertMessage
  }
});

export function register(user, setShowAlertMessage, handleChangeForm) {
  return function(dispatch) {
    dispatch(registerStarted());
    api
      .post("/addUser", {
        name: user.name,
        login: user.login,
        password: user.password
      })
      .then(res => {
        dispatch(registerSuccess("Registrado com Sucesso!"));
        setShowAlertMessage(true);
        handleChangeForm();
      })
      .catch(error => {
        // TODO: atualizar react-script para usar optional chaining
        if(error.response && error.response.data) {
          dispatch(
            registerFailed(
              error.response.data.error
            )
          );
        }
        else {
          dispatch(
            registerFailed(
              "Ocorreu um erro, tente novamente mais tarde."
            )
          );
        }
        setShowAlertMessage(true);
      });
  };
}

const registerStarted = () => ({
  type: Types.REGISTER_STARTED
});

const registerSuccess = alertMessage => ({
  type: Types.REGISTER_SUCCESS,
  payload: {
    alertMessage
  }
});

const registerFailed = alertMessage => ({
  type: Types.REGISTER_FAILED,
  payload: {
    alertMessage
  }
});

export function logout(history) {
  return function(dispatch) {
    dispatch({
      type: Types.LOGOUT
    });
    localStorage.setItem("loginValid", "false");
    localStorage.removeItem("login");
    localStorage.removeItem("name");
    history.push("/");
  };
}

export function updateUser(user) {
  return {
    type: Types.UPDATE_USER,
    user
  };
}
