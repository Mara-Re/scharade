import React, { createContext } from "react";
import { GameStatus, Player, Team, Word } from "../pages/Game";

interface StatusContextProps {
    playerExplaining?: Player;
    gameStatus?: GameStatus;
    nrOfWordsPerPlayer?: number;
    teamExplaining?: Team;
    currentRound?: number;
    setCountdown: (countdown: number) => void;
    reloadGame: () => void;
    reloadPlayerMe: () => void;
    reloadPlayersList: () => void;
    onError: (error: any) => void;
    error: any;
    isGameHost: boolean,
    reloadGameHost: () => void;
    countdown?: number;
    playerMe?: Player;
    playersList?: Player[];
    gameUid: string;
    wordsList: Word[];
    loadingGameStatus: boolean;
}

export const StatusContext = createContext<Partial<StatusContextProps>>({
    reloadGame: () => {},
    onError: () => {},
    gameUid: "",
    wordsList: [],
    loadingGameStatus: false,
});
