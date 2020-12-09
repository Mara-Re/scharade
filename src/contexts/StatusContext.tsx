import React, { createContext, FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getGameUid } from "../helper/getGameUid";
import statusMapping from "../helper/status-mapping";
import { GameLayout } from "../layouts/GameLayout";
import { socket } from "../pages/App";
import ErrorHandling from "../components/ErrorHandling";

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
    NONE = "NONE"
}

export interface Word {
    id: number;
    word: string;
    status?: WordStatus;
}

export type WordStatus = "guessed" | "guessedThisTurn" |"discardedThisTurn" | "notGuessedThisTurn" | "pile";

export type Team = "A" | "B"

interface StatusContextProps {
    playerExplaining?: PlayerExplaining;
    gameStatus?: GameStatus,
    setPlayerExplaining: (playerExplaining: PlayerExplaining) => void,
    reloadStatus: () => void,
    reloadTeam: () => void,
    onError: (error: any) => void,
    error: any,
    countdown?: number,
    team?: Team | null,
    gameUid: string,
    wordsList: Word[]
}

export const StatusContext = createContext<Partial<StatusContextProps>>({
    reloadStatus: () => {},
    onError: () => {},
    setPlayerExplaining: () => {},
    gameUid: "",
    wordsList: []
});

// TODO tests
// test refactored code with 2 open windows! playerExplaining SELF & OTHER!

const Game: FunctionComponent<{}>  = () => {

    const [team, setTeam] = useState<Team | null>();
    const [error, setError] = useState<any>();
    const [gameStatus, setGameStatus] = useState(GameStatus.SETUP);
    const [playerExplaining, setPlayerExplaining] = useState(PlayerExplaining.NONE);
    const [countdown, setCountdown] = useState<number>();


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
        socket.on("timer", (data: {countdown: number}) => {
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
    }, []);

    const getGameStatus = useCallback(async () => {
        try {
            const { data } = await axios.get(`/games/${gameUid}/status`);
            setGameStatus(data[0].status);
        } catch (error) {
            onError(error);
        }
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
                team: team,
                gameUid,
                setPlayerExplaining: setPlayerExplaining,
            }}
        >
            <GameLayout>
                <Component/>
                <ErrorHandling />
            </GameLayout>
        </StatusContext.Provider>
    )
}

export default Game;