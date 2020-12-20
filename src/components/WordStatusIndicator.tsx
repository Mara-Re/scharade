import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles({
    guessed: {
        color: "#4caf50",
        marginLeft: "20px",
    },
    discarded: {
        color: "#f44336",
        fontSize: "70px",
    },
});

interface WordCardProps {
    wordStatus: "guessedThisTurn" | "discardedThisTurn";
}

const WordStatusIndicator: FunctionComponent<WordCardProps> = (props) => {
    const { wordStatus } = props;

    const classes = useStyles();
    return (
        <Box alignSelf="center">
            {wordStatus === "guessedThisTurn" && (
                <CheckIcon className={classes.guessed} fontSize="large" />
            )}
            {wordStatus === "discardedThisTurn" && (
                <ClearIcon fontSize="large" className={classes.discarded} />
            )}
        </Box>
    );
};

export default WordStatusIndicator;
