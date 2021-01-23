import React, { FunctionComponent, useCallback, useContext } from "react";
import ActionMessage from "../components/ActionMessage";
import ReplayIcon from "@material-ui/icons/Replay";
import axios from "axios";
import { socket } from "../pages/Game";
import { StatusContext } from "../contexts/StatusContext";
import { GameStatus } from "../pages/Game";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    spacingTop: {
        marginTop: "30px"
    }
});

const EndOfRoundReached: FunctionComponent<{}> = () => {
    const {
        gameUid,
        onError = () => {},
        countdown,
    } = useContext(StatusContext);

    const classes = useStyles();

    const onStartNewRound = useCallback(async () => {
        try {
            socket.emit("start-new-round", { countdown });
        } catch (error) {
            onError(error);
        }
    }, [gameUid, countdown, onError]);

    return (
        <div className={classes.spacingTop}>
            <ActionMessage
                onAction={onStartNewRound}
                actionIcon={<ReplayIcon fontSize="large" />}
            >
                The pile of words is empty. Do you want to start a new round
                now?
            </ActionMessage>
        </div>
    );
};

export default EndOfRoundReached;
