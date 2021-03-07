import React, { FunctionComponent } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { roundsEmoji, roundsShort } from "./Rules";
import { Box, Typography } from "@material-ui/core";
import BorderedIconButton from "./IconButton";
import { PlayArrow } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    roundDescription: {
        width: "120px",
        margin: "0 10px",
    },
    roundSymbolContainer: {
        fontSize: "50px",
        margin: "0 10px",
    },
    playIconButton: {
        margin: "0 10px",
    },
    verticalCenterContent: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
    },
    reducedLineHeight: {
        lineHeight: "1.3"
    },
    spacingBottom : {
        marginBottom: "30px"
    }
}));

interface RoundIndicatorProps {
    round: number;
    indicateNextRound?: boolean;
    onStartNewRound?: () => void;
}

const RoundIndicator: FunctionComponent<RoundIndicatorProps> = ({
    round,
    indicateNextRound,
    onStartNewRound,
}) => {
    const classes = useStyles();

    return (
        <Box display="flex" justifyContent="center" className={classes.spacingBottom}>
            <div
                className={`${classes.roundSymbolContainer} ${classes.verticalCenterContent}`}
            >
                <div className={classes.verticalCenterContent}>
                    {roundsEmoji[round] || "❓"}
                </div>
            </div>
            <div
                className={`${classes.roundDescription} ${classes.verticalCenterContent}`}
            >
                <Typography variant="h6" className={classes.reducedLineHeight}>
                    <strong>
                        {indicateNextRound ? "Next up:" : `Round ${round + 1}:`}
                    </strong>
                </Typography>
                <Typography variant="h6" className={classes.reducedLineHeight}>
                    {roundsShort[round] || "Category of your choice"}
                </Typography>
            </div>
            {onStartNewRound && (
                <div
                    className={`${classes.playIconButton} ${classes.verticalCenterContent}`}
                >
                    <BorderedIconButton
                        onClick={onStartNewRound}
                        color="primary"
                    >
                        <PlayArrow fontSize="large" />
                    </BorderedIconButton>
                </div>
            )}
        </Box>
    );
};

export default RoundIndicator;
