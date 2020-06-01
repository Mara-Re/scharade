import React, {useState, useEffect} from 'react';
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import WordCard from "./components/WordCard";
import Timer from "./components/Timer";
import WordsList from "./components/WordsList";
import ActionMessage from "./components/ActionMessage";
import CssBaseline from '@material-ui/core/CssBaseline';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';

import {socket} from './start';
import RestartGame from "./components/RestartGame"

const timeToExplain = 11;

// TODO s
// add round column to games table and add get and post request to set the round
// show time over when game status === "timeOver"

// TODO s bauernscharade
// add status to game for setup
// enable players to enter words to the game
// add functionality to start game after words have been entered

// TODO s players
// enable players to enter their names
// show which players are currently in the game
// show which player is currently explaining
// show live with socket, which players are in the game and which have left

// TODO s private games
// add uuid for games for url
// add socket functionality for private games
// add functionality to set up a private game

// TODO handle exceptions / fix bugs
// handle case if reloading game and status is end of round reached
// make sure that only one person can be explaining at a time

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    toolbar: {
        minHeight: 100,
        alignItems: 'flex-start',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        alignSelf: 'center',
    },
    centerBox: {
        minHeight: "40vh",
        paddingBottom: '30px'
    },

    pageContainer: {
        position: "relative",
        minHeight: "100vh"
    },
    wordsListBox: {
        paddingBottom: "50px"
    },
    contentContainer: {
        padding: "0 20px"
    }
}));

const App = () => {
    const classes = useStyles();
    const [wordToExplain, setWordToExplain] = useState({});
    const [wordsExplained, setWordsExplained] = useState([]);
    const [wordsDiscarded, setWordsDiscarded] = useState([]);
    const [countdown, setCountdown] = useState();
    const [playerExplaining, setPlayerExplaining] = useState(); // undefined, "self", "other"
    const [gameStatus, setGameStatus] = useState(""); // "start", "playerExplaining", "timeOver", "endOfRoundReached"
    const [score, setScore] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        getGameStatus();
    }, []);

    const getGameStatus = async () => {
        try {
            const {data} = await axios.get('/game-status');
            if (data[0].success === false) {
                onError();
                return;
            }
            const gameStatus = data[0].status;
            setGameStatus(gameStatus);
        } catch (error) {
            onError(error);
        }
    }

    const onError = (e) => {
        setError(true);
        setTimeout(() => {setError(undefined)}, 2000);
    }

    useEffect(() => {
        socket.on("other-player-starts-explaining", () => {
            onOtherPlayerStartsExplaining();
        });
    }, []);


    //---------SOCKET EVENT LISTENERS-----------------------
    useEffect(() => {
        socket.on("end-of-round-reached", () => {
            setGameStatus("endOfRoundReached");
        });
    }, []);

    useEffect(() => {
        socket.on("timer", (data) => {
            setCountdown(data.countdown);
        });
    }, []);

    useEffect(() => {
        socket.on("new-round-started", () => {
            setGameStatus("playerExplaining");
            if (playerExplaining === "self") {
                getRandomWord();
            }
        });
    }, [playerExplaining]);

    //^^^^^^^^SOCKET EVENT LISTENERS^^^^^^^^^^--------

    useEffect(() => {
        if (countdown === undefined) {
            onTimerOver();
        }
    }, [countdown]);

    useEffect(() => {
        if (playerExplaining === "self" && !wordToExplain) {
            onEndOfRoundReached();
        }
    }, [wordToExplain, playerExplaining]);


    const onEndOfRoundReached = async () => {
        try {
            await axios.post('/game-status', {status: "endOfRoundReached"});
            socket.emit("end-of-round");
            setGameStatus("endOfRoundReached");
        } catch (error) {
            onError(error);
        }

    }

    const onTimerOver = async () => {
        setGameStatus("timeOver");
        if (playerExplaining == "self" && wordsExplained) {
            setScore(wordsExplained.length);
        }
    }

    const onOtherPlayerStartsExplaining = () => {
        setGameStatus("playerExplaining");
        setPlayerExplaining("other");
        setWordToExplain({});
        setWordsExplained([]);
        setWordsDiscarded([]);
        setScore(undefined);
    };

    const onStartExplaining = async () => {
        try {
            await axios.post('/game-status', {status: 'playerExplaining'});
            await axios.post('/reset-discarded-words');
            await getRandomWord();
            setCountdown(timeToExplain);
            setPlayerExplaining("self");
            setWordsExplained([]);
            setWordsDiscarded({});
            setGameStatus("playerExplaining");
            socket.emit("start-explaining");
        } catch(e) {
            onError(error);
        }
    }

    const onStartNewRound = async () => {
        try {
            await axios.post('/reset-words-status');
            setGameStatus("playerExplaining");
            socket.emit("start-new-round", {countdown});
            if (playerExplaining === "self") {
                getRandomWord();
            }
        } catch (error) {
            onError(error);
        }

    }
    const onRestartGame = async () => {
        try {
            await axios.post('/restart-game');
            setGameStatus("start");
            setWordsExplained([]);
            setWordsDiscarded([]);
            setWordToExplain({});
        } catch (error) {
            onError(error);
        }
    }

    const getRandomWord = async () => {
        try {
            const {data} = await axios.get('/random-word');
            const randomWord = data[0];
            setWordToExplain(randomWord);
        } catch (error) {
            onError(error);
        }
    }

    const onWordGuessed = async () => {
        try {
            await axios.post('/words', {id: wordToExplain.id, status: "guessed"});
            setWordsExplained([...wordsExplained, wordToExplain]);
            await getRandomWord();
        } catch (error) {
            onError(error);
        }
    }

    const onWordDiscarded = async () => {
        try {
            await axios.post('/words', {id: wordToExplain.id, status: "discarded"});
            setWordsDiscarded([...wordsDiscarded, wordToExplain]);
            await getRandomWord();
        } catch (error) {
            onError(error);
        }
    }

    const showTimer = !!countdown && (gameStatus === "playerExplaining" || gameStatus === "endOfRoundReached") || gameStatus === "timeOver";
    const showStartExplaining = gameStatus === "start" || gameStatus === "timeOver" && playerExplaining !== "self";
    const showWordCard = gameStatus === "playerExplaining" && wordToExplain && playerExplaining === "self";
    const showOtherPlayerExplaining = gameStatus === "playerExplaining" && playerExplaining === "other";
    const showWordsExplainedList =(gameStatus === "playerExplaining" || gameStatus === "timeOver" || gameStatus === "endOfRoundReached") && !!wordsExplained.length && playerExplaining === "self";
    const showWordsDiscardedList =(gameStatus === "playerExplaining" || gameStatus === "timeOver" || gameStatus === "endOfRoundReached") && !!wordsDiscarded.length && playerExplaining === "self";
    const showScore = gameStatus === "timeOver" && playerExplaining === "self" && score !== undefined;
    const showEndOfRoundReached = gameStatus === "endOfRoundReached";
    
    return (
        <div className={classes.pageContainer}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Bauern-Scharade
                    </Typography>
                    { showTimer &&
                    <Timer>{countdown}</Timer>}
                </Toolbar>
            </AppBar>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={error}
                autoHideDuration={6000}
                message="Something went wrong..."
            />
            <Box className={classes.contentContainer}>
                <Box display="flex" alignSelf="center" justifyContent="center" className={classes.centerBox} >
                    {showStartExplaining &&
                   <ActionMessage
                       onAction={onStartExplaining}
                       actionIcon={<PlayArrowIcon fontSize="large"/>}
                   >
                       Is it your turn? Start explaining.
                   </ActionMessage>}


                    {showWordCard &&
                    <WordCard
                        onWordGuessed={onWordGuessed}
                        onWordDiscarded={onWordDiscarded}
                    >
                        {wordToExplain.word}
                    </WordCard>}

                    {showEndOfRoundReached &&
                    <ActionMessage
                        onAction={onStartNewRound}
                        actionIcon={<ReplayIcon fontSize="large"/>}
                    >
                        The pile of words is empty. Do you want to start a new round now?
                    </ActionMessage>}
                    {showOtherPlayerExplaining &&
                    <ActionMessage
                    >
                        Somebody else is explaining...
                    </ActionMessage>}

                    {showScore &&
                    <ActionMessage
                    >
                        You scored {score} points in this round!
                    </ActionMessage>}
                </Box>
                <Box className={classes.wordsListBox}>
                    {showWordsExplainedList &&
                    <WordsList title="Explained Words" >{wordsExplained}</WordsList>
                    }
                    {showWordsDiscardedList &&
                    <WordsList title="Discarded Words" >{wordsDiscarded}</WordsList>
                    }
                </Box>
                <RestartGame
                    onRestartGame={onRestartGame}
                />
            </Box>
        </div>
    );
}

export default App;