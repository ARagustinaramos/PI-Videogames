let initialState = {
    genres: [],
    platforms: [],
    games: [],
    allGames: [],
    detail: [],
    currentPage: 1,
    firstMount: true,
  };
  
  function rootReducer(state = initialState, action) {
    switch (action.type) {
      case "GET_GENRES":
        return {
          ...state,
          genres: action.payload,
        };
      case "GET_GAMES":
        if (state.platforms.length !== 0) {
          return {
            ...state,
            games: action.payload,
            allGames: action.payload,
          };
        } else {
          let platforms = [];
          action.payload.forEach((game) =>
            game.platforms.forEach((platform) =>
              !platforms.includes(platform) ? platforms.push(platform) : null
            )
          );
          return {
            ...state,
            games: action.payload,
            allGames: action.payload,
            platforms,
          };
        }
      case "SET_FIRST_MOUNT":
        return {
          ...state,
          games: [],
          firstMount: action.payload,
        };
      case "GET_PLATFORMS":
        if (state.platforms.length === 0) {
          const platforms = [];
          state.allGames.forEach((game) => {
            game.platforms.forEach((p) =>
              !platforms.includes(p) ? platforms.push(p) : null
            );
          });
          return {
            ...state,
            platforms,
          };
        }
        return {
          ...state,
        };
      // console.log(platforms);
  
      case "SET_CURRENT_PAGE":
        return {
          ...state,
          currentPage: action.payload,
        };
      case "GET_NAME_GAMES":
        return {
          ...state,
          games: action.payload,
        };
      case "FILTER_GAMES":
        // console.log(action.payload.platform);
        // console.log(action.payload.genre);
        let filterGames = state.allGames;
        // console.log(action.payload[0]);
        // console.log(action.payload[1]);
        // console.log(action.payload[2]);
        // console.log(filterGames);
        // console.log(action.payload.platform);
        // filterGames.forEach((game) => {
        //   console.log(game.platforms);
        //   console.log(game.platforms.includes(action.payload.platform));
        // });
        // console.log(filterGames);
        filterGames =
          action.payload.platform !== "all"
            ? filterGames.filter((game) =>
                game.platforms.includes(action.payload.platform) ? game : null
              )
            : filterGames;
        // console.log(filterGames);
        filterGames =
          action.payload.genre !== "all"
            ? filterGames.filter((game) =>
                game.genres.includes(action.payload.genre)
              )
            : filterGames;
        // console.log(filterGames);
        filterGames =
          action.payload.source === "all"
            ? filterGames
            : action.payload.source === "api"
            ? filterGames.filter((g) => !g.createdInDb)
            : filterGames.filter((g) => g.createdInDb);
        // console.log(filterGames);
        return {
          ...state,
          games: filterGames.length === 0 ? ["empty"] : filterGames,
        };
      case "ORDER":
        if (action.payload[0] === "name") {
          const sortedGames =
            action.payload[1] === "asc"
              ? state.games.sort(function (a, b) {
                  if (a.name > b.name) return 1;
                  if (a.name < b.name) return -1;
                  return 0;
                })
              : state.games.sort(function (a, b) {
                  if (a.name > b.name) return -1;
                  if (a.name > b.name) return 1;
                  return 0;
                });
          return {
            ...state,
            games: sortedGames,
          };
        } else {
          const sortedGames =
            action.payload[1] === "asc"
              ? state.games.sort(function (a, b) {
                  if (a.rating > b.rating) return 1;
                  if (a.rating < b.rating) return -1;
                  return 0;
                })
              : state.games.sort(function (a, b) {
                  if (a.rating > b.rating) return -1;
                  if (a.rating < b.rating) return 1;
                  return 0;
                });
          return {
            ...state,
            games: sortedGames,
          };
        }
      case "GET_DETAILS":
        return {
          ...state,
          detail: action.payload,
        };
      case "RESET_DETAIL":
        return {
          ...state,
          detail: [],
        };
      case "POST_GAME":
        return {
          ...state,
        };
  
      default:
        return {
          ...state,
        };
    }
  }
  
  export default rootReducer;
  