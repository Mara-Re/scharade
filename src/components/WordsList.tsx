import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import axios from "axios";
import { getGameUid } from "../helper/getGameUid";
import { WordStatus, Word } from "../pages/App";

const useStyles = makeStyles({
    green: {
        color: "#4caf50"
    },
    red: {
        color: "#d32f2f"
    },
    noColor: {},
    wordsListBox: {
        paddingBottom: "20px"
    }
});

interface WordsListProps {
    title: string;
    setWordsList?: (wordsList: Word[]) => void;
    words: Word[];
}

const WordsList: FunctionComponent<WordsListProps> = (props) => {
    const {
        title,
        setWordsList,
        words
    } = props;

    const classes = useStyles();
    const gameUid = getGameUid();

    const getStatusColor = (status?: WordStatus) =>  status === "guessed" && "green" || status === "discarded" && "red" || "noColor";

    const changeWordStatus = async (wordId: number, oldWordStatus: WordStatus) => {
        if (!oldWordStatus || oldWordStatus === "pile" || !setWordsList) return;
        const newWordStatus: WordStatus | undefined = (oldWordStatus === "guessed" && "discarded") || ((oldWordStatus === "discarded" || oldWordStatus === "notGuessed") && "guessed") || undefined;
        if (!newWordStatus) return;
        // TODO: fix bug if the same word is in list twice because new round was started. (Fix in db update AND calc of newWordsList)

        await axios.post(`/games/${gameUid}/words/${wordId}/status`, {status: newWordStatus});

        const newWordsList = (words || []).map(word => {
            if (word.id === wordId) {
                return {...word, status: newWordStatus};
            }
            return word;
        });
        setWordsList(newWordsList);
    }

    return (
        <Box display='flex' justifyContent='center' alignSelf="center" className={classes.wordsListBox}>
            <TableContainer >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{title}</TableCell>
                            {setWordsList && (
                                <>
                                    <TableCell />
                                    <TableCell />
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {words.map(word => (
                                <TableRow key={word.id}>
                                    <TableCell className={classes[getStatusColor(word.status)]}>
                                        {word.word}
                                    </TableCell>
                                    {setWordsList &&
                                    <>
                                        <TableCell className={classes[getStatusColor(word.status)]}>
                                            {word.status === "guessed" && "+1" || word.status === "discarded" && "-1" || undefined}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => word.status && changeWordStatus(word.id, word.status)}>
                                                {word.status === "guessed" && <ClearIcon fontSize="small" />}
                                                {(word.status === "discarded" || word.status === "notGuessed") &&
                                                <CheckIcon fontSize="small" />}
                                            </IconButton>
                                        </TableCell>
                                    </>
                                    }
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    );
}

export default WordsList;