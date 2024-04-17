import axios from "axios";

export function getGenres() {
  return async function (dispatch) {
    try {
      const json = await axios.get("/genre");
      return dispatch({
        type: "GET_GENRES",
        payload: json.data,
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export function getGames() {
  return async function (dispatch) {
    try {
      const json = await axios.get("/videogames");
      return dispatch({
        type: "GET_GAMES",
        payload: json.data,
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export function setFirstMount(payload) {
  return {
    type: "SET_FIRST_MOUNT",
    payload,
  };
}

export function getPlatforms() {
  return {
    type: "GET_PLATFORMS",
  };
}

export function setCurrentPage(payload) {
  return {
    type: "SET_CURRENT_PAGE",
    payload,
  };
}

export function filterGames(payload) {
  return {
    type: "FILTER_GAMES",
    payload,
  };
}

export function order(payload) {
  return {
    type: "ORDER",
    payload,
  };
}

export function getNameGame(payload) {
  return function (dispatch) {
    axios
      .get("/videogames?name=" + payload)
      .then((json) => dispatch({ type: "GET_NAME_GAMES", payload: json.data }))
      .catch((e) =>
        dispatch({
          type: "GET_NAME_GAMES",
          payload: ["empty"],
        })
      );
  };
}

export function getDetails(payload) {
  return async function (dispatch) {
    try {
      const response = await axios.get("/videogames/" + payload);
      return dispatch({
        type: "GET_DETAILS",
        payload: response.data,
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export function resetDetail() {
  return {
    type: "RESET_DETAIL",
  };
}

export function deleteGame(payload) {
  return async function () {
    try {
      const response = await axios.delete("/videogames/delete/" + payload);
      return response;
    } catch (e) {
      console.log(e);
    }
  };
}

export function updateGame(payload) {
  return async function () {
    try {
      const response = await axios.put("/videogames/update", payload);
      return response;
    } catch (e) {
      console.log(e);
    }
  };
}


export function postGame(payload) {
  return async function () {
    try {
      const response = await axios.post("/videogames/add", payload);
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}