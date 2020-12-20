import React, { FunctionComponent, useEffect, useState } from "react";
import CentralBox from "../components/CentralBox";
import ActionMessage from "../components/ActionMessage";
import { socket } from "../pages/App";
import WordCard from "../components/WordCard";

interface NewWordGuessedOrDiscarded {
    status: "guessedThisTurn" | "discardedThisTurn";
    guessedWord?: string;
}

const OtherPlayerExplainingView: FunctionComponent<{}> = () => {
    const [
        newWordGuessedOrDiscarded,
        setNewWordGuessedOrDiscarded,
    ] = useState<NewWordGuessedOrDiscarded>();

    useEffect(() => {
        socket.on("word-was-guessed", (data: { guessedWord: string }) => {
            setNewWordGuessedOrDiscarded({
                status: "guessedThisTurn",
                guessedWord: data.guessedWord,
            });
        });
        socket.on("word-was-discarded", () => {
            setNewWordGuessedOrDiscarded({ status: "discardedThisTurn" });
        });
    }, []);

    useEffect(() => {
        if (!newWordGuessedOrDiscarded) return;
        setTimeout(() => {
            setNewWordGuessedOrDiscarded(undefined);
        }, 3000);
    }, [newWordGuessedOrDiscarded]);

    return (
        <CentralBox>
            <ActionMessage spacing={true}>
                Somebody else is explaining...
            </ActionMessage>
            {newWordGuessedOrDiscarded && (
                <WordCard wordStatus={newWordGuessedOrDiscarded.status}>
                    {newWordGuessedOrDiscarded.guessedWord}
                </WordCard>
            )}
        </CentralBox>
    );
};

export default OtherPlayerExplainingView;
