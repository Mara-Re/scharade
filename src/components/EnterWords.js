import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import WordsList from "./WordsList";
import StartGame from "./StartGame";
import { getGameUid } from "../helper/getGameUid";

const useStyles = makeStyles({
    enterWordsBox: {
        padding: "40px 0",
        margin: "auto",
        textAlign: "center"
    },
    wordInput: {
        padding: "0 0 1rem",
        display: "block"
    },
    submitButton: {
        margin: "0 0 1rem"
    }
});

const EnterWords = (props) => {
    const {
        onError
    } = props;

    const gameUid = getGameUid();
    const classes = useStyles();
    const [wordInput, setWordInput] = useState("");
    const [wordsSubmitted, setWordsSubmitted] = useState([])

    const onChange = (event) => {
        setWordInput(event.target.value);
    }

    const onWordSubmit = async () => {
        if (!wordInput) {
            return;
        }
        try {
            const {data} = await axios.post(`/words/${gameUid}`, {word: wordInput});
            setWordsSubmitted([...wordsSubmitted, data[0]]);
            setWordInput("");
        } catch (error) {
            onError(error);
        }
    }

    const onEnter = async (event) => {
        if (event.key === "Enter") {
            await onWordSubmit();
        }
    }

    return (
        <Box justifyContent='center' alignItems="center" className={classes.enterWordsBox}>
            <Typography variant="h6" gutterBottom>
                Enter your word here
            </Typography>
            <TextField variant='outlined' onChange={onChange} className={classes.wordInput} value={wordInput} onKeyDown={onEnter}/>
            <Button variant='contained' color='primary' onClick={onWordSubmit} className={classes.submitButton}>Add word to pile</Button>
            {!!wordsSubmitted.length && <WordsList title="Words you added">{wordsSubmitted}</WordsList>}
        </Box>



    );
}

export default EnterWords;