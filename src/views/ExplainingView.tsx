import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import CentralBox from "../components/CentralBox";
import { StatusContext } from "../contexts/StatusContext";
import WordCard from "../components/WordCard";
import { socket } from "../pages/Game";
import axios from "axios";
import EndOfRoundReached from "../containers/EndOfRoundReached";
import TurnScore from "../components/TurnScore";
import WordsList from "../components/WordsList";
import { GameStatus, Word, WordStatus } from "../pages/Game";

const ExplainingView: FunctionComponent<{}> = () => {
    const {
        gameUid,
        onError = () => {},
        reloadStatus = () => {},
        gameStatus,
        loadingGameStatus,
    } = useContext(StatusContext);

    const [wordToExplain, setWordToExplain] = useState<Word>();
    const [wordsList, setWordsList] = useState<Word[]>([]);

    useEffect(() => {
        if (gameStatus == GameStatus.PLAYER_EXPLAINING) {
            getRandomWord();
        }
    }, [gameStatus]);

    useEffect(() => {
        getWordsList();
    }, [gameStatus]);

    const getRandomWord = useCallback(async () => {
        try {
            const { data } = await axios.get(`/games/${gameUid}/getRandomWord`);
            const randomWord = data[0];
            setWordToExplain(randomWord);
            if (!randomWord) {
                onEndOfRoundReached();
            }
        } catch (error) {
            onError(error);
        }
    }, [gameUid, onError]);

    const onEndOfRoundReached = useCallback(async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, {
                status: GameStatus.END_OF_ROUND_REACHED,
            });
            await reloadStatus();
            socket.emit("end-of-round");
        } catch (error) {
            onError(error);
        }
    }, [gameUid]);

    const getWordsList = useCallback(async () => {
        try {
            const { data } = await axios.get(`/games/${gameUid}/words`);

            setWordsList(data);
        } catch (error) {
            onError(error);
        }
    }, [gameUid]);

    const changeWordStatus = useCallback(
        async (word: Word, newWordStatus?: WordStatus) => {
            if (!newWordStatus || word.status === newWordStatus) return;
            try {
                await axios.post(`/games/${gameUid}/words/${word.id}/status`, {
                    status: newWordStatus,
                });
                await getWordsList();
                if (
                    gameStatus === GameStatus.PLAYER_EXPLAINING &&
                    newWordStatus === "guessedThisTurn"
                ) {
                    socket.emit("guessed-word", { guessedWord: word.word });
                }
                if (
                    gameStatus === GameStatus.PLAYER_EXPLAINING &&
                    newWordStatus === "discardedThisTurn"
                ) {
                    socket.emit("discarded-word");
                }
                if (word.status === "pile") {
                    await getRandomWord();
                }
            } catch (error) {
                onError(error);
            }
        },
        [getWordsList, getRandomWord, gameUid, gameStatus]
    );

    const showTurnScore =
        gameStatus === GameStatus.END_OF_ROUND_REACHED ||
        gameStatus === GameStatus.TIME_OVER;

    if (loadingGameStatus) return <></>;

    return (
        <>
            <CentralBox>
                {showTurnScore && <TurnScore wordsList={wordsList} />}
                {gameStatus === GameStatus.END_OF_ROUND_REACHED && (
                    <EndOfRoundReached />
                )}
                {gameStatus === GameStatus.PLAYER_EXPLAINING && wordToExplain && (
                    <WordCard
                        onWordGuessed={() =>
                            changeWordStatus(wordToExplain, "guessedThisTurn")
                        }
                        onWordDiscarded={() =>
                            changeWordStatus(wordToExplain, "discardedThisTurn")
                        }
                    >
                        {wordToExplain?.word}
                    </WordCard>
                )}
            </CentralBox>
            <WordsList
                title="Words"
                onChangeWordStatus={changeWordStatus}
                showWordStatusModifiers={true}
                words={
                    gameStatus === GameStatus.TIME_OVER
                        ? wordsList
                        : // do not show words that were drawn but not guessed yet in words list
                          wordsList.filter(
                              (word) => word.status !== "notGuessedThisTurn"
                          )
                }
            />
        </>
    );
};

export default ExplainingView;
