import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import CentralBox from "../components/CentralBox";
import { socket } from "../pages/Game";
import WordCard from "../components/WordCard";
import { StatusContext } from "../contexts/StatusContext";
import TeamEmoji from "../components/TeamEmoji";
import CenterBox from "../components/CenterBox";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    spacing: {
        marginTop: "30px",
        marginBottom: "60px",
    },
}));

interface NewWordGuessedOrDiscarded {
    status: "guessedThisTurn" | "discardedThisTurn";
    guessedWord?: string;
}

const OtherPlayerExplainingView: FunctionComponent<{}> = () => {
    const { teamExplaining, playerExplaining } = useContext(StatusContext);

    const classes = useStyles();
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
                <Typography variant="h6" className={classes.spacing}>
                    {teamExplaining && playerExplaining && (
                        <>
                            {playerExplaining.name}{" "}
                            <TeamEmoji team={teamExplaining} /> is explaining...
                        </>
                    )}
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
