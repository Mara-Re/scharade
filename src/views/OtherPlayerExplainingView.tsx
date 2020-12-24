import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import CentralBox from "../components/CentralBox";
import ActionMessage from "../components/ActionMessage";
import { socket } from "../pages/Game";
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

    const [fadeOutClassName, setFadeOutClassName] = useState<
        "fadeOut1" | "fadeOut2"
    >();

    const timeOutRef = useRef<number>();

    const onNewWord = useCallback(
        (newWordGuessedOrDiscarded: NewWordGuessedOrDiscarded) => {
            clearTimeout(timeOutRef.current);
            setNewWordGuessedOrDiscarded(newWordGuessedOrDiscarded);
            setFadeOutClassName((prevClassName) => {
                return prevClassName === "fadeOut1" ? "fadeOut2" : "fadeOut1";
            });
        },
        []
    );

    useEffect(() => {
        socket.on("word-was-guessed", (data: { guessedWord: string }) => {
            onNewWord({
                status: "guessedThisTurn",
                guessedWord: data.guessedWord,
            });
        });
        socket.on("word-was-discarded", () => {
            onNewWord({ status: "discardedThisTurn" });
        });

    }, []);

    useEffect(() => {
        if (!newWordGuessedOrDiscarded) return;
        timeOutRef.current = setTimeout(() => {
            setNewWordGuessedOrDiscarded(undefined);
        }, 3000);
    }, [newWordGuessedOrDiscarded]);

    return (
        <CentralBox>
            <ActionMessage spacing={true}>
                Somebody else is explaining...
            </ActionMessage>
            {newWordGuessedOrDiscarded && (
                <WordCard
                    wordStatus={newWordGuessedOrDiscarded.status}
                    fadeOutClassName={fadeOutClassName}
                >
                    {newWordGuessedOrDiscarded.guessedWord}
                </WordCard>
            )}
        </CentralBox>
    );
};

export default OtherPlayerExplainingView;
