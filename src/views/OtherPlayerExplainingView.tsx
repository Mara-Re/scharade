import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import CentralBox from "../components/CentralBox";
import ActionMessage from "../components/ActionMessage";
import { socket } from "../pages/Game";
import WordCard from "../components/WordCard";
import { StatusContext } from "../contexts/StatusContext";
import TeamEmoji from "../components/TeamEmoji";
import CenterBox from "../components/CenterBox";
import { Typography } from "@material-ui/core";

interface NewWordGuessedOrDiscarded {
    status: "guessedThisTurn" | "discardedThisTurn";
    guessedWord?: string;
}

const OtherPlayerExplainingView: FunctionComponent<{}> = () => {
    const { teamExplaining, playerExplaining } = useContext(StatusContext);

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
            <CenterBox>
                <Typography variant="h6">
            {/*<ActionMessage spacing={true}>*/}
                {teamExplaining && playerExplaining && (
                    <>
                        {playerExplaining.name}{" "}
                        <TeamEmoji team={teamExplaining} /> is explaining...
                    </>
                )}
                {!teamExplaining && <>Someone else is explaining...</>}
            {/*</ActionMessage>*/}
                </Typography>
            </CenterBox>
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
