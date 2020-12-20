import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import BorderedIconButton from "./IconButton";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles({
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
});

interface WordCardProps {
    onWordGuessed: () => void;
    onWordDiscarded: () => void;
}

const WordActions: FunctionComponent<WordCardProps> = (props) => {
    const { onWordGuessed, onWordDiscarded } = props;

    const classes = useStyles();
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignSelf="center"
            className={classes.buttonBox}
        >
            <BorderedIconButton
                onClick={onWordGuessed}
                className={classes.guessed}
            >
                <CheckIcon fontSize="large" />
            </BorderedIconButton>
            <BorderedIconButton
                onClick={onWordDiscarded}
                className={classes.discard}
            >
                <ClearIcon fontSize="large" />
            </BorderedIconButton>
        </Box>
    );
};

export default WordActions;
