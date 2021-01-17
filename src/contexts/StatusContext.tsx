import React, { createContext } from "react";
import { GameStatus, PlayerExplaining, Team, Word } from "../pages/Game";

interface StatusContextProps {
    playerExplaining?: PlayerExplaining;
    gameStatus?: GameStatus;
    setPlayerExplaining: (playerExplaining: PlayerExplaining) => void;
    setCountdown: (countdown: number) => void;
    reloadStatus: () => void;
    reloadTeam: () => void;
    onError: (error: any) => void;
    error: any;
    countdown?: number;
    team?: Team | null;
    gameUid: string;
    wordsList: Word[];
    loadingGameStatus: boolean;
}

export const StatusContext = createContext<Partial<StatusContextProps>>({
    reloadStatus: () => {},
    onError: () => {},
    setPlayerExplaining: () => {},
    gameUid: "",
    wordsList: [],
    loadingGameStatus: false,
});
