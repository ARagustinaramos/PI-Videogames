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
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          if (state.platforms.length !== 0) {
            return {
              ...state,
              games: action.payload,
              allGames: action.payload,
            };
          } else {
            let platforms = [];
            action.payload.forEach((game) =>
              Array.isArray(game.platforms) && game.platforms.forEach((platform) =>
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
        } else {
          return state;
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
            Array.isArray(game.platforms) && game.platforms.forEach((p) =>
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
        let originalGames = state.allGames.slice(); // Hacer una copia de allGames
  
        // Filtrar por plataforma si la plataforma no es "all"
        if (action.payload.platform !== "all") {
          originalGames = originalGames.filter(game =>
            Array.isArray(game.platforms) && game.platforms.includes(action.payload.platform)
          );
        }
  
        // Filtrar por género si el género no es "all"
        if (action.payload.genre !== "all") {
          originalGames = originalGames.filter(game =>
            Array.isArray(game.genres) && game.genres.includes(action.payload.genre)
          );
        }
  
        // Filtrar por fuente de origen
        if (action.payload.source !== "all") {
          if (action.payload.source === "api") {
            originalGames = originalGames.filter(g => !g.createdInDb);
          } else {
            originalGames = originalGames.filter(g => g.createdInDb);
          }
        }
  
        return {
          ...state,
          games: originalGames.length === 0 ? ["empty"] : originalGames,
        };
      case "ORDER":
        if (action.payload[0] === "name") {
          const sortedGames =
            action.payload[1] === "asc"
              ? state.games.sort((a, b) => a.name.localeCompare(b.name))
              : state.games.sort((a, b) => b.name.localeCompare(a.name));
          return {
            ...state,
            games: sortedGames,
          };
        } else {
          const sortedGames =
            action.payload[1] === "asc"
              ? state.games.sort((a, b) => a.rating - b.rating)
              : state.games.sort((a, b) => b.rating - a.rating);
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
        return state;
    }
  }
  
  export default rootReducer;
  