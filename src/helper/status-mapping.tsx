import { GameStatus } from "../pages/Game";
import { FunctionComponent } from "react";
import assertUnreachable from "./assert-unreachable";
import GameSetupView from "../views/GameSetupView";
import StartExplainingView from "../views/StartExplainingView";
import ExplainingView from "../views/ExplainingView";
import OtherPlayerExplainingView from "../views/OtherPlayerExplainingView";
import EndOfRoundReachedView from "../views/EndOfRoundReachedView";
import EndOfGameView from "../views/EndOfGameView";

const statusMapping = (
    gameStatus: GameStatus,
    isPlayerMeExplaining: boolean | undefined
): FunctionComponent<any> => {
    switch (gameStatus) {
        case GameStatus.SETUP:
            return GameSetupView;
        case GameStatus.START:
            return StartExplainingView;
        case GameStatus.PLAYER_EXPLAINING:
            if (isPlayerMeExplaining) {
                return ExplainingView;
            }
            return OtherPlayerExplainingView;
        case GameStatus.END_OF_ROUND_REACHED:
            if (isPlayerMeExplaining) {
                return ExplainingView;
            }
            return EndOfRoundReachedView;
        case GameStatus.TIME_OVER:
            if (isPlayerMeExplaining) {
                return ExplainingView;
            }
            return StartExplainingView;
        case GameStatus.END:
            return EndOfGameView;
    }

    return assertUnreachable(gameStatus);
};

export default statusMapping;
