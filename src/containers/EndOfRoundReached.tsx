import React, { FunctionComponent, useCallback, useContext } from "react";
import ActionMessage from "../components/ActionMessage";
import ReplayIcon from "@material-ui/icons/Replay";
import { socket } from "../pages/Game";
import { StatusContext } from "../contexts/StatusContext";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import TeamEmoji from "../components/TeamEmoji";
import CenterBox from "../components/CenterBox";
import { roundsShort } from "../components/Rules";

const useStyles = makeStyles({
    spacingTop: {
        marginTop: "30px",
    },
    increasedGutter: {
        marginBottom: "1rem",
    },
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
        <div className={classes.spacingTop}>
            {/*<CenterBox>*/}
            {/*    <Typography variant="h2" gutterBottom>*/}
            {/*        <TeamEmoji team={teamExplaining} />*/}
            {/*    </Typography>*/}
            {/*</CenterBox>*/}
            <ActionMessage
                onAction={onStartNewRound}
                actionIcon={<ReplayIcon fontSize="large" />}
            >
                <strong>Round {currentRound + 2}: {roundsShort[currentRound + 1]} </strong><br />
                <small>Do you want to start the new round now?</small>
            </ActionMessage>
            {/*<CenterBox>*/}
            {/*    <Typography variant="h6">*/}
            {/*        /!*next round*!/*/}
            {/*        */}
            {/*    </Typography>*/}
            {/*</CenterBox>*/}
        </div>
    );
};

export default EndOfRoundReached;
