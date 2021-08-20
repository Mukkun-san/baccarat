import { request } from "./request";

const API_URL = "https://baccarat-simulator.herokuapp.com"; //  "http://localhost:1212"

async function runSimulation(strategies, nbrOfBets) {
  return await request(API_URL + "/sim/run/", "POST", {
    strategies,
    nbrOfBets,
  });
}

async function getStrats() {
  return await request(API_URL + "/sim/strats/", "GET");
}

export { runSimulation, getStrats };
