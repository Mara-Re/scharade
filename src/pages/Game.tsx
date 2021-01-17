import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";

import * as io from "socket.io-client";
import { StatusContext } from "../contexts/StatusContext";
import statusMapping from "../helper/status-mapping";
import { getGameUid } from "../helper/getGameUid";
import axios from "axios";
import { GameLayout } from "../layouts/GameLayout";
import ErrorHandling from "../components/ErrorHandling";
export const socket = io.connect();

const timeToExplain = 60;


export enum GameStatus {
    SETUP = "SETUP",
    START = "START",
    PLAYER_EXPLAINING = "PLAYER_EXPLAINING",
    TIME_OVER = "TIME_OVER",
    END_OF_ROUND_REACHED = "END_OF_ROUND_REACHED",
    END = "END",
}

export enum PlayerExplaining {
    SELF = "SELF",
    OTHER = "OTHER",
    NONE = "NONE",
}

export interface Word {
    id: number;
    word: string;
    status?: WordStatus;
}

export type WordStatus =
    | "guessed"
    | "guessedThisTurn"
    | "discardedThisTurn"
    | "notGuessedThisTurn"
    | "pile";

export type Team = "A" | "B";

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

// TODO
// check behaviour on mobile when deconnected -> reconnected (during timer running, after, before)
// -> is gameStatus reloaded?

// TODO rounds
// On "start explaining"/"end of round reached" show current/next round - 1. explaining, 2. pantomime, 3. one-word explanation, 4. finger pantomime, 5. make a sound
// add round column to games table and add get and post request to set the round
// after 5th round, players can start additional round(s) or "end game"

// TODO teams alternating order
// teams explain in alternating order
// players see which team is explaining

// TODO players
// enable players to enter their names
// show which players are currently in the game
// show which player is currently explaining
// enable players to kick out other players
// show live with socket, which players are in the game and which have left

// TODO handle exceptions / fix bugs / error handling
// handle case if reloading game and status is end of round reached
// add error handling to <Home />

// TODO ideas
// show list with guessed words and number of discarded words to other players at "time-over" and "end-of-round-reached"


const Game: FunctionComponent<{}> = () => {
    const [team, setTeam] = useState<Team | null>();
    const [loadingGameStatus, setLoadingGameStatus] = useState(true);
    const [error, setError] = useState<any>();
    const [gameStatus, setGameStatus] = useState(GameStatus.SETUP);
    const [playerExplaining, setPlayerExplaining] = useState(
        PlayerExplaining.NONE
    );
    const [countdown, setCountdown] = useState<number>();
    const [isGameHost, setIsGameHost] = useState(false);


    const Component = statusMapping(gameStatus, playerExplaining);

    //---------SOCKET EVENT LISTENERS-----------------------
    useEffect(() => {
        socket.on("game-started", () => {
            getGameStatus();
        });
        socket.on("game-ended", () => {
            getGameStatus();
        });
        socket.on("end-of-round-reached", () => {
            getGameStatus();
        });
        socket.on("timeOver", () => {
            getGameStatus();
        });
        socket.on("new-round-started", () => {
            getGameStatus();
        });
    }, []);

    useEffect(() => {
        socket.on("other-player-starts-explaining", () => {
            getGameStatus();
            setPlayerExplaining(PlayerExplaining.OTHER);
        });
    }, []);

    useEffect(() => {
        socket.on("timer", (data: { countdown: number }) => {
            setCountdown(data.countdown);
        });
    }, []);

    //^^^^^^^^SOCKET EVENT LISTENERS^^^^^^^^^^--------
    const gameUid = useMemo(() => getGameUid(), [getGameUid]);

    const getTeam = useCallback(async () => {
        try {
            const { data } = await axios.get(`/team-cookie`);
            setTeam(data.team);
        } catch (error) {
            onError(error);
        }
    }, []);

    const onError = (error: any) => {
        setError(error);
        setTimeout(() => {
            setError(undefined);
        }, 2000);
    };

    useEffect(() => {
        getGameStatus();
        getTeam();
        getGameHost();
    }, []);

    const getGameHost = useCallback(async () => {
        try {
            const { data } = await axios.get("/game-cookies");
            setIsGameHost(data.isGameHost);
        } catch (error) {
            onError(error);
        }
    }, []);

    const getGameStatus = useCallback(async () => {
        setLoadingGameStatus(true);
        try {
            const { data } = await axios.get(`/games/${gameUid}/status`);
            setGameStatus(data[0].status);
        } catch (error) {
            onError(error);
        }
        setLoadingGameStatus(false);
    }, []);

    return (
        <StatusContext.Provider
            value={{
                playerExplaining: playerExplaining,
                gameStatus: gameStatus,
                reloadStatus: getGameStatus,
                reloadTeam: getTeam,
                onError: onError,
                error: error,
                countdown: countdown,
                setCountdown: setCountdown,
                team: team,
                gameUid,
                setPlayerExplaining: setPlayerExplaining,
                loadingGameStatus: loadingGameStatus,
                isGameHost,
                reloadGameHost: getGameHost
            }}
        >
            <GameLayout>
                {!loadingGameStatus && <Component />}
                <ErrorHandling />
            </GameLayout>
        </StatusContext.Provider>
    );
};

export default Game;
