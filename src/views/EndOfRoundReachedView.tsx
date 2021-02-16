import React, { FunctionComponent, useContext } from "react";
import CentralBox from "../components/CentralBox";
import EndOfRoundReached from "../containers/EndOfRoundReached";
import CenterBox from "../components/CenterBox";
import { Typography } from "@material-ui/core";
import TeamEmoji from "../components/TeamEmoji";
import { roundsShort } from "../components/Rules";
import { makeStyles } from "@material-ui/core/styles";
import { StatusContext } from "../contexts/StatusContext";

const useStyles = makeStyles({
    spacingTop: {
        marginTop: "30px",
    },
    increasedGutter: {
        marginBottom: "2rem",
    },
});

const EndOfRoundReachedView: FunctionComponent<{}> = () => {
    const { teamExplaining, playerExplaining, currentRound = 0 } = useContext(
        StatusContext
    );

    const classes = useStyles();

    if (!teamExplaining || !playerExplaining) return null;

    return (
        <CentralBox>
            <div className={classes.spacingTop}>
                <CenterBox>
                    <Typography
                        variant="h6"
                        gutterBottom={true}
                    >
                        You've reached the end of round {currentRound + 1}.
                    </Typography>
                    <Typography
                        variant="h6"
                        className={classes.increasedGutter}
                    >
                        {playerExplaining.name}{" "}
                        <TeamEmoji team={teamExplaining} /> can start the next
                        round now.
                    </Typography>
                    <Typography variant="h6">
                        {/*next round*/}
                        Round {currentRound + 2}:{" "}
                        {roundsShort[currentRound + 1]}
                    </Typography>
                </CenterBox>
            </div>
        </CentralBox>
    );
};

export default EndOfRoundReachedView;
