import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from "react";
import { Word } from "../pages/Game";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    actionText: {
        maxWidth: "60vw",
    },
    score: {
        marginLeft: 40,
        // @ts-ignore
        fontWeight: "400",
    },
});

const TurnScore: FunctionComponent<{ wordsList: Word[] }> = ({ wordsList }) => {
    const [turnScore, setTurnScore] = useState(0);

    const classes = useStyles();

    useEffect(() => {
        getTurnScore(wordsList);
    }, [wordsList]);

    const getTurnScore = useCallback(
        (wordsList: Word[]) => {
            const guessedWords = wordsList.filter(
                (word) => word.status === "guessedThisTurn"
            );
            const discardedWords = wordsList.filter(
                (word) => word.status === "discardedThisTurn"
            );

            setTurnScore(guessedWords.length - discardedWords.length);
        },
        [wordsList]
    );
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h6" className={classes.actionText}>
                Your score in this round:
            </Typography>
            <Typography variant="h3" color="primary" className={classes.score}>
                {turnScore}
            </Typography>
        </Box>
    );
};

export default TurnScore;
