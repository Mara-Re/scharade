import React, { createContext } from "react";
import { GameConfig, GameStatus, Player, Team, Word } from "../pages/Game";

interface StatusContextProps {
    playerExplaining?: Player;
    gameStatus?: GameStatus;
    gameConfig?: GameConfig;
    teamExplaining?: Team;
    setCountdown: (countdown: number) => void;
    reloadStatus: () => void;
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
    reloadStatus: () => {},
    onError: () => {},
    gameUid: "",
    wordsList: [],
    loadingGameStatus: false,
});
