import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import WordsList from "./WordsList";
import { getGameUid } from "../helper/getGameUid";
import { StatusContext } from "../contexts/StatusContext";
import { socket, Word } from "../pages/Game";
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles({
    enterWordsBox: {
        padding: "0 0 40px",
        margin: "auto",
        textAlign: "center",
    },
    wordInput: {
        padding: "0 0 1rem",
        display: "block",
    },
    submitButton: {
        margin: "0 0 1rem",
        position: "relative"
    },
    submitSuccess: {
        color: "transparent !important"
    },
    success: {
        color: "white",
        position: "absolute"
    }
});

const EnterWords: FunctionComponent<{}> = (props) => {
    const { onError = () => {},  reloadPlayersList = () => {} } = useContext(StatusContext);

    const gameUid = getGameUid();
    const classes = useStyles();
    const [wordInput, setWordInput] = useState<string>("");
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [wordsSubmitted, setWordsSubmitted] = useState<Word[]>([]);

    const onChange = (event: any) => {
        setWordInput(event.target.value);
    };

    const onWordSubmit = async () => {
        if (!wordInput) {
            return;
        }
        try {
            const { data } = await axios.post(`/games/${gameUid}/words`, {
                word: {
                    word: wordInput,
                    status: "pile",
                    gameUid,
                },
            });
            socket.emit("new-word-submit");
            reloadPlayersList();
            setWordsSubmitted([...wordsSubmitted, data[0]]);
            setSubmitSuccess(true);
            setWordInput("");
        } catch (error) {
            onError(error);
        }
    };

    useEffect(() => {
        if (submitSuccess) {
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 500);
        }
    }, [submitSuccess]);

    const onEnter = async (event: any) => {
        if (event.key === "Enter") {
            await onWordSubmit();
        }
    };

    return (
        <Box
            justifyContent="center"
            alignItems="center"
            className={classes.enterWordsBox}
        >
            <Typography variant="h6" gutterBottom>
                Enter words
            </Typography>
            <Typography variant="body1" gutterBottom>
                Agree on how many words each player should enter (e.g. 5). Enter word by word.
            </Typography>
            <TextField
                variant="outlined"
                onChange={onChange}
                className={classes.wordInput}
                value={wordInput}
                onKeyDown={onEnter}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={onWordSubmit}
                disabled={submitSuccess}
                className={`${classes.submitButton} ${submitSuccess ? classes.submitSuccess : ""}`}
            >
                Add word to pile
                {submitSuccess && <CheckIcon className={classes.success}/>}
            </Button>
            {!!wordsSubmitted.length && (
                <WordsList title="Words you added" words={wordsSubmitted} />
            )}
        </Box>
    );
};

export default EnterWords;
