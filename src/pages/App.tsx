import React from "react";

import * as io from "socket.io-client";
import Game from "../contexts/StatusContext";
export const socket = io.connect();

const timeToExplain = 60;

///// Allow socket reconnects on mobile devices without page reload////
let isConnected = false;
let socketTimeoutId: number;
const RETRY_INTERVAL = 2000;

socket.on("connected", function () {
    isConnected = true;
    clearTimeout(socketTimeoutId);
});

socket.on("disconnected", function () {
    isConnected = false;
    retryConnectOnFailure(RETRY_INTERVAL);
});

const retryConnectOnFailure = (retryInMilliseconds: number) => {
    setTimeout(function () {
        if (!isConnected) {
            retryConnectOnFailure(retryInMilliseconds);
        }
    }, retryInMilliseconds);
};
retryConnectOnFailure(RETRY_INTERVAL);
//////////////////////////////////////////////////

// TODO s
// when restart game -> start new game id, do not delete old game, lead to other url & show other players hint to switch to new game room
// show words that were just guessed to non-explaining players
// show if a to non-explaining players if a word was discarded
// show list with guessed words and number of discarded words to other players at "time-over" and "end-of-round-reached"

// TODO s rounds
// 5 rounds: - 1. explaining, 2. pantomime, 3. one-word explanation, 4. finger pantomime, 5. make a sound
// add round column to games table and add get and post request to set the round
// game ends when player clicks on end game, show final scores or after 5 rounds

// TODO s onboarding
// Explain game
// Explain enter words
// Explain explanation rounds
// Explain necessary setup steps: enter 5 words, form 2 teams, note scores for each player,
// Explain the different rounds - 1. explaining, 2. pantomime, 3. one-word explanation, 4. finger pantomime, 5. make a sound

// TODO s teams alternating order
// teams explain in alternating order
// players see which team is explaining

// TODO s players
// enable players to enter their names
// show which players are currently in the game
// show which player is currently explaining
// enable players to kick out other players
// show live with socket, which players are in the game and which have left

// TODO handle exceptions / fix bugs / error handling
// handle case if reloading game and status is end of round reached
// add error handling to <Home />
// remove hardcoded timeToExplain from App.js -> retrieve via get request instead

const App = () => {
    return <Game />;
};

export default App;
