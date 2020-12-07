import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import ActionMessage from "../components/ActionMessage";
import { Word } from "../contexts/StatusContext";

const TurnScore: FunctionComponent<{ wordsList: Word[] }> = ({
    wordsList
}) => {
    const [turnScore, setTurnScore] = useState(0);

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
        <ActionMessage>
            You scored {turnScore} points in this round!
        </ActionMessage>
    );
};

export default TurnScore;
