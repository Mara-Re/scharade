import React, {
    FunctionComponent,
    useCallback, useContext,
    useEffect,
    useState
} from "react";
import { Word } from "../pages/Game";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import TeamEmoji from "./TeamEmoji";
import { StatusContext } from "../contexts/StatusContext";

const useStyles = makeStyles({
    score: {
        marginLeft: 40,
        // @ts-ignore
        fontWeight: "400",
    },
    spacingTop: {
        marginTop: "20px"
    }
});

const TurnScore: FunctionComponent<{ wordsList: Word[], loading: boolean }> = ({ wordsList, loading }) => {
    const { teamExplaining } = useContext(StatusContext);
    const [turnScore, setTurnScore] = useState<number>();

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
        <Box display="flex" justifyContent="center" alignItems="center" className={classes.spacingTop}>
            <Typography variant="h6">
                {teamExplaining ? <TeamEmoji team={teamExplaining} /> : ""} Your score in this turn:
            </Typography>
            <Typography variant="h3" color="primary" className={classes.score}>
                {turnScore !== undefined && !loading && turnScore}
            </Typography>
        </Box>
    );
};

export default TurnScore;
