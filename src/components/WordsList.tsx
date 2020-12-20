import React, { FunctionComponent, useCallback, useContext } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import axios from "axios";
import { getGameUid } from "../helper/getGameUid";
import { WordStatus, Word } from "../contexts/StatusContext";
import { StatusContext } from "../contexts/StatusContext";

const useStyles = makeStyles({
    green: {
        color: "#4caf50",
    },
    red: {
        color: "#d32f2f",
    },
    noColor: {},
    wordsListBox: {
        paddingBottom: "20px",
    }
});

interface WordsListProps {
    title: string;
    showWordStatusModifiers?: boolean;
    words?: Word[];
    onChangeWordStatus?: (word: Word, newWordStatus?: WordStatus) => void;
}

const WordsList: FunctionComponent<WordsListProps> = (props) => {
    const {
        title,
        showWordStatusModifiers,
        words,
        onChangeWordStatus = () => {},
    } = props;

    const classes = useStyles();

    const getStatusColor = (status?: WordStatus) =>
        (status === "guessedThisTurn" && "green") ||
        (status === "discardedThisTurn" && "red") ||
        "noColor";

    const getNewWordStatus = useCallback((prevWordStatus: WordStatus) => {
        const newWordStatus: WordStatus | undefined =
            (prevWordStatus === "guessedThisTurn" && "discardedThisTurn") ||
            ((prevWordStatus === "discardedThisTurn" ||
                prevWordStatus === "notGuessedThisTurn") &&
                "guessedThisTurn") ||
            undefined;
        return newWordStatus
    }, []);

    return (
        <Box className={classes.wordsListBox}>
            <Box
                display="flex"
                justifyContent="center"
                alignSelf="center"
                className={classes.wordsListBox}
            >
                {words && !!words.length && (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{title}</TableCell>
                                    {showWordStatusModifiers && (
                                        <>
                                            <TableCell />
                                            <TableCell />
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {words.map((word) => (
                                    <TableRow key={word.id}>
                                        <TableCell
                                            className={
                                                classes[
                                                    getStatusColor(word.status)
                                                ]
                                            }
                                        >
                                            {word.word}
                                        </TableCell>
                                        {showWordStatusModifiers && (
                                            <>
                                                <TableCell
                                                    className={
                                                        classes[
                                                            getStatusColor(
                                                                word.status
                                                            )
                                                        ]
                                                    }
                                                >
                                                    {(word.status ===
                                                        "guessedThisTurn" &&
                                                        "+1") ||
                                                        (word.status ===
                                                            "discardedThisTurn" &&
                                                            "-1") ||
                                                        undefined}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() =>
                                                            word.status &&
                                                            onChangeWordStatus(
                                                                word,
                                                                getNewWordStatus(word.status)
                                                            )
                                                        }
                                                    >
                                                        {word.status ===
                                                            "guessedThisTurn" && (
                                                            <ClearIcon fontSize="small" />
                                                        )}
                                                        {(word.status ===
                                                            "discardedThisTurn" ||
                                                            word.status ===
                                                                "notGuessedThisTurn") && (
                                                            <CheckIcon fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default WordsList;
