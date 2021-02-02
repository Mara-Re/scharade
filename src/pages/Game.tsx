import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import * as io from "socket.io-client";
import { StatusContext } from "../contexts/StatusContext";
import statusMapping from "../helper/status-mapping";
import { getGameUid } from "../helper/getGameUid";
import axios from "axios";
import { GameLayout } from "../layouts/GameLayout";
import ErrorHandling from "../components/ErrorHandling";
import PlayerJoinGameDialog from "../components/PlayerJoinGameDialog";
import GameLinkDialog from "../components/GameLinkDialog";
export const socket = io.connect();

export enum GameStatus {
    SETUP = "SETUP",
    START = "START",
    PLAYER_EXPLAINING = "PLAYER_EXPLAINING",
    TIME_OVER = "TIME_OVER",
    END_OF_ROUND_REACHED = "END_OF_ROUND_REACHED",
    END = "END",
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

export interface Player {
    id: number;
    teamAorB: Team;
    name: string;
    gameUid: string;
    nrOfWords?: number;
    enterWordsCompleted: boolean;
}

export interface GameConfig {
    nrOfWordsPerPlayer: number;
}

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

// DONE
// show which players are currently in the game
// show how many words each player has entered on gameSetup
// enable players to change / delete words they have entered during game setup


// TODO
// adjust info to preconfigured nr of words
// enable players / game host to adjust nrOfWords in game config
// help: is the game stuck (because a player left or lost their connection)? Reset turn/Game host can reset turn

// TODO sounds
// add sound on time over
// add sound on start explaining
// add sound guessed word
// add sound discarded word
// add sound player joined

// TODO rounds
// On "start explaining"/"end of round reached" show current/next round - 1. explaining, 2. pantomime, 3. one-word explanation, 4. finger pantomime, 5. make a sound
// add round column to games table and add get and post request to set the round
// after 5th round, players can start additional round(s) or "end game"

// TODO handle exceptions / fix bugs / error handling
// handle case if reloading game and status is end of round reached
// add error handling to <Home />

// TODO ideas
// show list with guessed words and number of discarded words to other players at "time-over" and "end-of-round-reached"

// TODO automatically determine players turns
// automatically determine whose player's turn it is
// enable players to kick out other players

const Game: FunctionComponent<{}> = () => {
    const [playerMe, setPlayerMe] = useState<Player>();
    const [playersList, setPlayersList] = useState<Player[]>();
    const [loadingGameStatus, setLoadingGameStatus] = useState(true);
    const [loadingPlayerMe, setLoadingPlayerMe] = useState(true);
    const [error, setError] = useState<any>();
    const [gameStatus, setGameStatus] = useState(GameStatus.SETUP);
    const [teamExplaining, setTeamExplaining] = useState<Team>();
    const [playerExplaining, setPlayerExplaining] = useState<Player>();
    const [countdown, setCountdown] = useState<number>();
    const [isGameHost, setIsGameHost] = useState(false);
    const [showGameLinkDialog, setShowGameLinkDialog] = useState<boolean>();
    const [gameConfig, setGameConfig] = useState<GameConfig>();

    const isPlayerMeExplaining: boolean | undefined =
        playerExplaining && playerMe && playerExplaining?.id === playerMe?.id;

    const Component = statusMapping(gameStatus, isPlayerMeExplaining);

    //---------SOCKET EVENT LISTENERS-----------------------
    useEffect(() => {
        socket.on("new-game-status", () => {
            getGameStatus();
        });
        socket.on("players-list-changed", () => {
            getPlayersList();
        });
        socket.on("connected", async () => {
            const currentGameStatus = await getGameStatus();
            getPlayersList();
            getPlayerMe();
            if (currentGameStatus !== GameStatus.END_OF_ROUND_REACHED) {
                setCountdown(undefined);
            }
        });
    }, []);

    useEffect(() => {
        socket.on("timer", (data: { countdown: number }) => {
            setCountdown(data.countdown);
        });
    }, []);

    //^^^^^^^^SOCKET EVENT LISTENERS^^^^^^^^^^--------
    const gameUid = useMemo(() => getGameUid(), [getGameUid]);

    const onError = useCallback((error: any) => {
        setError(error);
        setTimeout(() => {
            setError(undefined);
        }, 2000);
    }, []);

    const getPlayerMe = useCallback(async () => {
        setLoadingPlayerMe(true);
        try {
            const { data } = await axios.get(`/games/${gameUid}/playerMe`);
            if (data) {
                setPlayerMe(data[0]);
            }
        } catch (error) {
            onError(error);
        }
        setLoadingPlayerMe(false);
    }, [onError, gameUid]);

    const getPlayersList = useCallback(async () => {
        try {
            const { data } = await axios.get(`/games/${gameUid}/players`);
            if (data) {
                setPlayersList(data);
            }
        } catch (error) {
            onError(error);
        }
    }, [onError, gameUid]);

    const getGameStatus = useCallback(async (): Promise<
        GameStatus | undefined
        > => {
        setLoadingGameStatus(true);
        try {
            const { data } = await axios.get(`/games/${gameUid}`);
            const playerExplainingId = data[0].player_explaining_id;
            if (playerExplainingId) {
                const { data: playerData } = await axios.get(
                    `/games/${gameUid}/player/${playerExplainingId}`
                );
                const newPlayerExplaining = playerData[0] as Player;
                setPlayerExplaining(newPlayerExplaining);
            }
            const newGameStatus = data[0].status as GameStatus;
            const newTeamExplaining = data[0].team_explaining as Team;
            const nrOfWordsPerPlayer = data[0].nr_of_words_per_player as number;
            setGameConfig({ nrOfWordsPerPlayer });
            setGameStatus(newGameStatus);
            setTeamExplaining(newTeamExplaining);
            setLoadingGameStatus(false);
            return newGameStatus;
        } catch (error) {
            onError(error);
            setLoadingGameStatus(false);
            return undefined;
        }
    }, [onError, gameUid]);

    const getGameHost = useCallback(async () => {
        try {
            const { data } = await axios.get("/game-cookies");
            setIsGameHost(data.isGameHost);
        } catch (error) {
            onError(error);
        }
    }, [onError]);

    useEffect(() => {
        getGameStatus();
        getPlayerMe();
        getGameHost();
        getPlayersList();
    }, [getGameStatus, getPlayerMe, getPlayersList, getGameHost]);

    useEffect(() => {
        const getShowGameLinkDialogInfo = async () => {
            try {
                const { data } = await axios.get("/game-cookies");
                setShowGameLinkDialog(data.showGameLinkDialog);
            } catch (error) {
                onError(error);
            }
        };
        getShowGameLinkDialogInfo();
    }, [onError]);

    return (
        <StatusContext.Provider
            value={{
                gameUid,
                isGameHost,
                playerExplaining,
                gameStatus,
                teamExplaining,
                playerMe,
                playersList,
                setCountdown,
                countdown,
                onError,
                error,
                loadingGameStatus,
                gameConfig,
                reloadStatus: getGameStatus,
                reloadPlayerMe: getPlayerMe,
                reloadGameHost: getGameHost,
                reloadPlayersList: getPlayersList,
            }}
        >
            <GameLayout>
                {showGameLinkDialog && (
                    <GameLinkDialog
                        setShowGameLinkDialog={setShowGameLinkDialog}
                    />
                )}
                {showGameLinkDialog === false &&
                    !playerMe &&
                    !loadingPlayerMe && <PlayerJoinGameDialog />}
                {playerMe && !loadingGameStatus && <Component />}
                <ErrorHandling />
            </GameLayout>
        </StatusContext.Provider>
    );
};

export default Game;
