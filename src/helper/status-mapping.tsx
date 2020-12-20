import { GameStatus, PlayerExplaining } from "../contexts/StatusContext";
import { FunctionComponent } from "react";
import assertUnreachable from "./assert-unreachable";
import GameSetupView from "../views/GameSetupView";
import StartExplainingView from "../views/StartExplainingView";
import ExplainingView from "../views/ExplainingView";
import OtherPlayerExplainingView from "../views/OtherPlayerExplainingView";
import EndOfRoundReachedView from "../views/EndOfRoundReachedView";
import EndOfGameView from "../views/EndOfGameView";


const statusMapping = (gameStatus: GameStatus, playerExplaining: PlayerExplaining): FunctionComponent<any> => {
    switch (gameStatus) {
        case GameStatus.SETUP:
            return GameSetupView;
        case GameStatus.START:
            return StartExplainingView;
        case GameStatus.PLAYER_EXPLAINING:
            if (playerExplaining === PlayerExplaining.SELF) {
                return ExplainingView;
            }
            return OtherPlayerExplainingView;
        case GameStatus.END_OF_ROUND_REACHED:
            if (playerExplaining === PlayerExplaining.SELF) {
                return ExplainingView;
            }
            return EndOfRoundReachedView;
        case GameStatus.TIME_OVER:
            if (playerExplaining === PlayerExplaining.SELF) {
                return ExplainingView;
            }
            return StartExplainingView;
        case GameStatus.END:
            return EndOfGameView;
    }

    return assertUnreachable(gameStatus);
}

export default statusMapping;