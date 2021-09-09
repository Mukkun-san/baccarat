import { MAIN_API_URL } from "../../stores/sessionStore";
import { request } from "./request";

async function saveRecordDB(bet, game_id) {
  return await request(MAIN_API_URL + "/game/", "POST", {
    _id: game_id,
    bet,
  });
}

async function resetGameDB(game_id) {
  return await request(MAIN_API_URL + "/game/reset/" + game_id, "DELETE");
}

async function undoRecordDB(game_id) {
  return await request(MAIN_API_URL + "/game/undo/" + game_id, "DELETE");
}

async function getAllGames(user_id) {
  return await request(MAIN_API_URL + "/game/all/" + user_id, "GET");
}

async function getAllStrategies() {
  return await request(MAIN_API_URL + "/game/strategies/all/", "GET");
}

async function createGame(user_id, strategies, name, type) {
  return await request(MAIN_API_URL + "/game/create/", "POST", {
    user_id,
    strategies,
    name,
    type,
  });
}

async function deleteGame(_id) {
  return await request(MAIN_API_URL + "/game/" + _id, "DELETE");
}

async function fetchGame(_id) {
  return await request(MAIN_API_URL + "/game/" + _id, "GET");
}

export {
  saveRecordDB,
  resetGameDB,
  undoRecordDB,
  getAllGames,
  getAllStrategies,
  createGame,
  deleteGame,
  fetchGame,
};
