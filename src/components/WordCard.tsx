import React, { FunctionComponent, ReactNode } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import WordActions from "./WordActions";
import WordStatusIndicator from "./WordStatusIndicator";

const useStyles = makeStyles({
    wordBox: {
        maxWidth: "60vw",
        overflowWrap: "break-word",
    },
    guessed: {
        color: "#4caf50",
        marginBottom: 10,
    },
    discard: {
        color: "#f44336",
    },
    buttonBox: {
        marginLeft: 30,
    },
    fadeOut1: {
        animation: "$fadeOut1 ease 3s",
        opacity: "0.1",
    },
    fadeOut2: {
        animation: "$fadeOut2 ease 3s",
        opacity: "0.1",
    },
    "@keyframes fadeOut1": {
        "0%": {
            opacity: 1,
        },
        "100%": {
            opacity: 0.1,
        },
    },
    "@keyframes fadeOut2": {
        "0%": {
            opacity: 1,
        },
        "100%": {
            opacity: 0.1,
        },
    }
});

interface WordCardProps {
    children?: ReactNode;
    onWordGuessed?: () => void;
    onWordDiscarded?: () => void;
    wordStatus?: "guessedThisTurn" | "discardedThisTurn";
    fadeOutClassName?: "fadeOut1" | "fadeOut2";
}

const WordCard: FunctionComponent<WordCardProps> = (props) => {
    const { children, onWordGuessed, onWordDiscarded, fadeOutClassName, wordStatus } = props;

    const classes = useStyles();

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignSelf="center"
            className={(wordStatus && fadeOutClassName) ? classes[fadeOutClassName]: ""}
        >
            <Box display="flex" justifyContent="space-between">
                <Box alignSelf="center" className={classes.wordBox}>
                    <Typography variant="h4">{children}</Typography>
                </Box>
                {onWordDiscarded && onWordGuessed ? (
                    <WordActions
                        onWordDiscarded={onWordDiscarded}
                        onWordGuessed={onWordGuessed}
                    />
                ) : (
                    wordStatus && (
                        <WordStatusIndicator wordStatus={wordStatus} />
                    )
                )}
            </Box>
        </Box>
    );
};

export default WordCard;
