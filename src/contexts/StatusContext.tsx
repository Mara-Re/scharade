import React, { createContext } from "react";
import { GameStatus, Player, Team, Word } from "../pages/Game";

interface StatusContextProps {
    playerExplaining?: Player;
    gameStatus?: GameStatus;
    teamExplaining?: Team;
    setCountdown: (countdown: number) => void;
    reloadStatus: () => void;
    reloadPlayerMe: () => void;
    onError: (error: any) => void;
    error: any;
    isGameHost: boolean,
    reloadGameHost: () => void;
    countdown?: number;
    playerMe?: Player;
    gameUid: string;
    wordsList: Word[];
    loadingGameStatus: boolean;
}

export const StatusContext = createContext<Partial<StatusContextProps>>({
    reloadStatus: () => {},
    onError: () => {},
    gameUid: "",
    wordsList: [],
    loadingGameStatus: false,
});
