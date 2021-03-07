import React, {
    FunctionComponent,
    useCallback,
    useContext,
} from "react";
import { socket } from "../pages/Game";
import { StatusContext } from "../contexts/StatusContext";
import { makeStyles } from "@material-ui/core/styles";
import RoundIndicator from "../components/RoundIndicator";

const useStyles = makeStyles({
    spacingBottom: {
        marginBottom: "70px"
    }
});

const EndOfRoundReached: FunctionComponent<{}> = () => {
    const {
        countdown,
        playerMe,
        teamExplaining,
        playerExplaining,
        currentRound = 0,
    } = useContext(StatusContext);

    const classes = useStyles();

    const onStartNewRound = useCallback(async () => {
        socket.emit("start-new-round", { countdown });
    }, [countdown]);

    if (!teamExplaining || !playerExplaining || !playerMe) return null;

    return (
        <div className={classes.spacingBottom}>
                <RoundIndicator
                    round={currentRound + 1}
                    indicateNextRound={true}
                    onStartNewRound={onStartNewRound}
                />
        </div>
    );
};

export default EndOfRoundReached;
