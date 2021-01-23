import React, { createContext } from "react";
import { GameStatus, PlayerExplaining, Team, Word } from "../pages/Game";

interface StatusContextProps {
    playerExplaining?: PlayerExplaining;
    gameStatus?: GameStatus;
    setCountdown: (countdown: number) => void;
    reloadStatus: () => void;
    reloadTeam: () => void;
    onError: (error: any) => void;
    error: any;
    isGameHost: boolean,
    reloadGameHost: () => void;
    countdown?: number;
    team?: Team | null;
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
