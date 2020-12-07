import React, { FunctionComponent, useCallback, useContext } from "react";
import CentralBox from "../components/CentralBox";
import ActionMessage from "../components/ActionMessage";
import ReplayIcon from "@material-ui/icons/Replay";
import axios from "axios";
import { socket } from "../pages/App";
import { GameStatus, StatusContext } from "../contexts/StatusContext";

const EndOfRoundReached: FunctionComponent<{}> = () => {
    const {
        gameUid,
        reloadStatus = () => {},
        onError = () => {},
        countdown,
    } = useContext(StatusContext);

    const onStartNewRound = useCallback(async () => {
        try {
            await axios.post(`/games/${gameUid}/startNewRound`, {
                status: GameStatus.PLAYER_EXPLAINING,
            });
            reloadStatus();
            socket.emit("start-new-round", { countdown });
        } catch (error) {
            onError(error);
        }
    }, [gameUid, countdown, onError]);

    return (
        <ActionMessage
            onAction={onStartNewRound}
            actionIcon={<ReplayIcon fontSize="large" />}
        >
            The pile of words is empty. Do you want to start a new round now?
        </ActionMessage>
    );
};

export default EndOfRoundReached;
