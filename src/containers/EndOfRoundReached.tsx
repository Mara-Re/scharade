import React, { FunctionComponent, useCallback, useContext } from "react";
import ActionMessage from "../components/ActionMessage";
import ReplayIcon from "@material-ui/icons/Replay";
import { socket } from "../pages/Game";
import { StatusContext } from "../contexts/StatusContext";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import TeamEmoji from "../components/TeamEmoji";
import CenterBox from "../components/CenterBox";

const useStyles = makeStyles({
    spacingTop: {
        marginTop: "30px",
    },
});

const EndOfRoundReached: FunctionComponent<{}> = () => {
    const { countdown, playerMe, teamExplaining } = useContext(StatusContext);

    const classes = useStyles();

    const onStartNewRound = useCallback(async () => {
        socket.emit("start-new-round", { countdown });
    }, [countdown]);

    return (
        <div className={classes.spacingTop}>
            {teamExplaining && playerMe?.teamAorB !== teamExplaining && (
                <ActionMessage>
                    The pile of words is empty. Team{" "}
                    <TeamEmoji team={teamExplaining} /> can start a new
                    round now.
                </ActionMessage>
            )}
            {teamExplaining && playerMe?.teamAorB === teamExplaining && (
                <>
                    <CenterBox>
                        <Typography variant="h2" gutterBottom>
                            <TeamEmoji team={teamExplaining} />
                        </Typography>
                    </CenterBox>
                    <ActionMessage
                        onAction={onStartNewRound}
                        actionIcon={<ReplayIcon fontSize="large" />}
                    >
                        The pile of words is empty. Do you want to start a new
                        round now?
                    </ActionMessage>
                </>
            )}
        </div>
    );
};

export default EndOfRoundReached;
