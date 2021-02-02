import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { getGameUid } from "../helper/getGameUid";
import { StatusContext } from "../contexts/StatusContext";
import { socket } from "../pages/Game";
import { times, find, compact } from "lodash";

const useStyles = makeStyles({
    enterWordsBox: {
        padding: "0 0 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    wordInput: {
        padding: "0 0 1rem",
        display: "block",
    },
    submitButton: {
        margin: "0 0 1rem",
        position: "relative",
    },
    title: {
        marginBottom: "20px"
    }
});

const EnterWords: FunctionComponent<{}> = (props) => {
    const {
        onError = () => {},
        reloadPlayersList = () => {},
        reloadPlayerMe = () => {},
        gameConfig,
        playerMe,
    } = useContext(StatusContext);

    const gameUid = getGameUid();
    const classes = useStyles();
    const [words, setWords] = useState<string[]>(
        times(gameConfig?.nrOfWordsPerPlayer || 0, () => "")
    );

    const onChange = (event: any, index: number) => {
        setWords((prevWords) => {
            let words = [...prevWords];
            words[index] = event.target.value;
            return words;
        });
    };

    useEffect(() => {
        const getPlayersWords = async () => {
            try {
                const { data } = await axios.get(`/games/${gameUid}/words`);
                setWords(
                    times(gameConfig?.nrOfWordsPerPlayer || 0, (index) => {
                        const wordRow = find(data, { playerWordIndex: index });
                        return wordRow?.word || "";
                    })
                );
            } catch (error) {
                onError(error);
            }
        };
        getPlayersWords();
    }, []);

    const onBlur = useCallback(
        async (index: number) => {
            if (!words[index] === undefined) return;
            try {
                const { data } = await axios.post(`/games/${gameUid}/words`, {
                    word: words[index],
                    playerWordIndex: index,
                });
                if (data?.insertedOrDeleted) {
                    socket.emit("new-word-submit");
                    reloadPlayersList();
                }
            } catch (error) {
                onError(error);
            }
        },
        [words, gameUid, onError, reloadPlayersList]
    );

    const onDone = async () => {
        try {
            await axios.put(`/games/${gameUid}/playerMe/enterWordsCompleted`);
            socket.emit("new-player-status");
            reloadPlayerMe();
            reloadPlayersList();
        } catch (error) {
            onError(error);
        }
    };

    if (playerMe?.enterWordsCompleted) return null;

    return (
        <Box
            justifyContent="center"
            className={classes.enterWordsBox}
        >
            <Typography variant="h6" gutterBottom className={classes.title}>
                {`Enter ${gameConfig?.nrOfWordsPerPlayer} words`}
            </Typography>
            <div>
                {times(gameConfig?.nrOfWordsPerPlayer || 0, (i) => i).map(
                    (index) => (
                        <TextField
                            key={index}
                            onChange={(event) => {
                                event.persist();
                                onChange(event, index);
                            }}
                            className={classes.wordInput}
                            value={words[index]}
                            label={index + 1}
                            onBlur={() => onBlur(index)}
                        />
                    )
                )}
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={onDone}
                disabled={
                    compact(words).length !== gameConfig?.nrOfWordsPerPlayer
                }
                className={classes.submitButton}
            >
                Ready
            </Button>
        </Box>
    );
};

export default EnterWords;
